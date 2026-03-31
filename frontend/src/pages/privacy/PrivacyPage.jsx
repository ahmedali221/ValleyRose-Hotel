import React from 'react';
import { motion } from 'framer-motion';
import HeaderHero from '../../components/HeaderHero';
import { useTranslation } from '../../locales';

const PrivacyPage = () => {
    const { t } = useTranslation();

    const sections = [
        'overview', 'hosting', 'general', 'dataCollection',
        'analytics', 'plugins', 'ecommerce'
    ];

    return (
        <div className="bg-white">
            <HeaderHero showButtons={false} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* Page Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10 sm:mb-14"
                >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        {t('privacy.title')}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        {t('privacy.subtitle')}
                    </p>
                    <p className="text-sm text-gray-400 mt-3">
                        {t('privacy.lastUpdated')}
                    </p>
                </motion.div>

                {/* Privacy Sections */}
                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow duration-300"
                        >
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                                {t(`privacy.sections.${section}.title`)}
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                                {t(`privacy.sections.${section}.content`)}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
