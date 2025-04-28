import { BsRobot } from 'react-icons/bs';
import { FaLock } from 'react-icons/fa';
import { SiOpenai } from 'react-icons/si';
import { TbBrandGoogleFilled } from 'react-icons/tb';
import { HiSparkles } from 'react-icons/hi';

const Models = () => {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Models</h1>
            <div className="h-[1px] bg-gray-200 w-full mb-6"></div>

            {/* ChatGPT Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <SiOpenai className="text-xl" />
                    <span className="font-medium">ChatGPT (OpenAI)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 ml-7">
                    <BsRobot />
                    <span>GPT-4o</span>
                </div>
            </div>

            {/* Advanced Models Section */}
            <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Section */}
                    <div className="md:w-1/3">
                        <h2 className="text-blue-600 font-medium text-lg mb-2">Advanced Models</h2>
                        <p className="text-gray-600 text-sm mb-4">
                            Alternative models can provide improved results for specific use cases.
                        </p>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">
                            <FaLock className="text-sm" />
                            <span>Unlock Advanced Models</span>
                        </button>
                    </div>

                    {/* Middle Section */}
                    <div className="space-y-3 md:w-1/3">
                        <div className="flex items-center gap-2 text-sm">
                            <SiOpenai className="text-gray-600" />
                            <span>OpenAI o3 Mini</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <HiSparkles className="text-blue-500" />
                            <span>DeepSeek V3</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <HiSparkles className="text-blue-500" />
                            <span>DeepSeek R1</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <TbBrandGoogleFilled className="text-gray-600" />
                            <span>Gemini 2.0 Flash</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <TbBrandGoogleFilled className="text-gray-600" />
                            <span>Gemini 2.0 Pro</span>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="space-y-3 md:w-1/3">
                        <div className="flex items-center gap-2 text-sm">
                            <HiSparkles className="text-orange-400" />
                            <span>Claude 3.5 Haiku</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <HiSparkles className="text-orange-400" />
                            <span>Claude 3.7 Sonnet</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <BsRobot className="text-teal-600" />
                            <span>Sonar 3.1 Small</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <BsRobot className="text-teal-600" />
                            <span>Sonar 3.1 Large</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Models;
