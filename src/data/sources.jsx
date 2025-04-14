import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaFile, FaAlignLeft } from 'react-icons/fa'; // Icons for Sources
import { SiGoogledrive, SiZendesk, SiDropbox } from 'react-icons/si'; // Icons for Integrations
import { RiStackshareFill } from "react-icons/ri";
import { TbBrandOnedrive } from "react-icons/tb";

const Sources = ({ setSource }) => {
    const navigate = useNavigate();

    return (
        <div className='flex items-center justify-center h-fit bg-gray-50'>
            <div className='bg-white shadow-lg rounded-lg p-8 w-[400px]'>
                <div className='flex flex-col gap-6'>
                    {/* Sources Section */}
                    <div className='flex flex-col gap-3'>
                        <div className='text-sm font-semibold text-gray-500'>Sources</div>
                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center justify-between p-3 transition duration-200 rounded-lg cursor-pointer hover:bg-gray-100' onClick={() => {
                                setSource('website')
                            }}>
                                <div className='flex items-center gap-3'>
                                    <FaGlobe className='text-gray-500' />
                                    <span>Websites</span>
                                </div>
                                <span className='text-sm text-gray-400'>→</span>
                            </div>
                            <div className='flex items-center justify-between p-3 transition duration-200 rounded-lg cursor-pointer hover:bg-gray-100' onClick={() => {
                                setSource('document')
                            }}>
                                <div className='flex items-center gap-3'>
                                    <FaFile className='text-gray-500' />
                                    <span>Files</span>
                                </div>
                                <span className='text-sm text-gray-400'>→</span>
                            </div>
                            <div className='flex items-center justify-between p-3 transition duration-200 rounded-lg cursor-pointer hover:bg-gray-100' onClick={()=>{
                                setSource('text')
                            }}>
                                <div className='flex items-center gap-3'>
                                    <FaAlignLeft className='text-gray-500' />
                                    <span>Text</span>
                                </div>
                                <span className='text-sm text-gray-400'>→</span>
                            </div>
                        </div>
                    </div>

                    {/* Integrations Section */}
                    <div className='flex flex-col gap-3'>
                        <div className='text-sm font-semibold text-gray-500'>Integrations</div>
                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center justify-between p-3 transition duration-200 rounded-lg cursor-pointer hover:bg-gray-100' onClick={()=>{
                                setSource('googleDrive')
                            }}>
                                <div className='flex items-center gap-3'>
                                    <SiGoogledrive className='text-gray-500' />
                                    <span>Google Drive</span>
                                </div>
                                <span className='text-sm text-gray-400'>→</span>
                            </div>
                            <div className='flex items-center justify-between p-3 transition duration-200 rounded-lg cursor-pointer hover:bg-gray-100'>
                                <div className='flex items-center gap-3'>
                                    <SiZendesk className='text-gray-500' />
                                    <span>Zendesk</span>
                                </div>
                                <span className='text-sm text-gray-400'>→</span>
                            </div>
                            <div className='flex items-center justify-between p-3 transition duration-200 rounded-lg cursor-pointer hover:bg-gray-100' onClick={()=>{
                                setSource('oneDrive')
                            }}>
                                <div className='flex items-center gap-3'>
                                    <TbBrandOnedrive className='text-gray-500' />
                                    <span>OneDrive</span>
                                </div>
                                <span className='text-sm text-gray-400'>→</span>
                            </div>
                            <div className='flex items-center justify-between p-3 transition duration-200 rounded-lg cursor-pointer hover:bg-gray-100'>
                                <div className='flex items-center gap-3'>
                                    <RiStackshareFill className='text-gray-500' />
                                    <span>SharePoint</span>
                                </div>
                                <span className='text-sm text-gray-400'>→</span>
                            </div>
                            <div className='flex items-center justify-between p-3 transition duration-200 rounded-lg cursor-pointer hover:bg-gray-100'>
                                <div className='flex items-center gap-3'>
                                    <SiDropbox className='text-gray-500' />
                                    <span>Dropbox</span>
                                </div>
                                <span className='text-sm text-gray-400'>→</span>
                            </div>
                        </div>
                    </div>

                    {/* Character Usage Section */}
                    <div className='flex items-center justify-between p-4 rounded-lg bg-gray-50'>
                        <div className='flex flex-col gap-1'>
                            <div className='text-sm font-bold'>0 Characters</div>
                            <div className='text-sm text-gray-500'>of 500,000</div>
                        </div>
                        <div className='text-sm font-bold text-gray-700'>0%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sources;