// components/OneDrivePicker.js
import React, { useState, useCallback } from 'react';
import * as msal from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';
import 'bootstrap/dist/css/bootstrap.min.css';

const OneDrivePicker = ({ onFilesSelected, allowMultiple = true, fileTypes = ['.doc', '.docx', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx'] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // MSAL configuration
  const msalConfig = {
    auth: {
      clientId: process.env.REACT_APP_AZURE_CLIENT_ID || 'YOUR_CLIENT_ID',
      authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID || 'common'}`,
      redirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false,
    },
  };

  const msalInstance = new msal.PublicClientApplication(msalConfig);

  const signIn = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const loginRequest = {
        scopes: ['Files.Read', 'Files.ReadWrite', 'User.Read'],
      };
      
      const authResult = await msalInstance.loginPopup(loginRequest);
      setIsAuthenticated(true);
      return authResult.accessToken;
    } catch (error) {
      setError('Authentication failed. Please try again.');
      console.error('Login failed:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getGraphClient = useCallback(async (accessToken) => {
    const authProvider = {
      getAccessToken: async () => accessToken,
    };

    return Client.initWithMiddleware({
      authProvider,
    });
  }, []);

  const fetchFileContent = useCallback(async (client, fileId) => {
    try {
      const driveItem = await client.api(`/me/drive/items/${fileId}`).get();
      const downloadUrl = driveItem['@microsoft.graph.downloadUrl'];
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      return {
        id: fileId,
        name: driveItem.name,
        size: driveItem.size,
        type: driveItem.file.mimeType,
        lastModified: driveItem.lastModifiedDateTime,
        data: blob,
        downloadUrl,
      };
    } catch (error) {
      console.error('Error fetching file content:', error);
      throw error;
    }
  }, []);

  const selectFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const accessToken = await signIn();
      if (!accessToken) return;

      const client = await getGraphClient(accessToken);

      // Query OneDrive files
      const response = await client.api('/me/drive/root/children')
        .select('id,name,size,file,webUrl,lastModifiedDateTime')
        .filter(`file ne null and (${fileTypes.map(type => `endsWith(name,'${type}')`).join(' or ')})`)
        .get();

      if (!response || !response.value) {
        throw new Error('No files found');
      }

      // Process selected files
      const filePromises = response.value.map(file => fetchFileContent(client, file.id));
      const fileDetails = await Promise.all(filePromises);

      onFilesSelected(allowMultiple ? fileDetails : [fileDetails[0]]);
    } catch (error) {
      setError('Failed to select files. Please try again.');
      console.error('File selection failed:', error);
    } finally {
      setLoading(false);
    }
  }, [signIn, getGraphClient, fetchFileContent, onFilesSelected, allowMultiple, fileTypes]);

  return (
    <div className="onedrive-picker">
      <button 
        onClick={selectFiles} 
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        ) : null}
        Select Files from OneDrive
      </button>
      
      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default OneDrivePicker;