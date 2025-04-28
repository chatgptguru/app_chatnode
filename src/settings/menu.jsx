import {
    AiOutlineSetting,
    AiOutlineMessage,
    AiOutlineAppstore,
    AiOutlineSkin
} from 'react-icons/ai';
import {
    SiZapier,
    SiSlack
} from 'react-icons/si';
import { MdOutlineWebhook } from "react-icons/md";
import { TbBrandMeta } from 'react-icons/tb';
import { BiSolidMessage } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const Menu = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* General Settings Section */}
            <div className='flex flex-col space-y-4 w-full p-6 border-b border-gray-200'>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <MenuItem icon={<AiOutlineSetting size={20} />} title="General" path="/" />
                    <MenuItem icon={<AiOutlineMessage size={20} />} title="Prompts" path="/prompts" />
                    <MenuItem icon={<AiOutlineAppstore size={20} />} title="Models" path="/models" />
                    <MenuItem icon={<AiOutlineSkin size={20} />} title="Customize" path="/customize" />
                </div>
            </div>

            {/* Integrations Section */}
            <div className='p-6'>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Integrations</h2>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <MenuItem icon={<SiZapier size={20} />} title="Zapier" />
                    <MenuItem icon={<BiSolidMessage size={20} />} title="SiCrisp" />
                    <MenuItem icon={<SiSlack size={20} />} title="Slack" />
                    <MenuItem icon={<TbBrandMeta size={20} />} title="Make" />
                    <MenuItem icon={<MdOutlineWebhook size={20} />} title="Webhooks" />
                </div>
            </div>
        </div>
    );
}

const MenuItem = ({ icon, title, path, disabled }) => {
    const botId = useSelector((state) => state.layout.botId);
    const navigate = useNavigate();
    return (
        <div className={`
            flex items-center space-x-3 p-4 rounded-lg
            transition-all duration-200
            ${disabled
                ? 'bg-gray-100 cursor-not-allowed opacity-60'
                : 'bg-white hover:bg-gray-100 cursor-pointer shadow-sm hover:shadow-md'
            }
        `} onClick={() => navigate(`/bot/${botId}/settings${path.toLowerCase()}`)}>
            <span className="text-gray-600">{icon}</span>
            <span className="text-gray-700 font-medium">{title}</span>
        </div>
    );
}

export default Menu;
