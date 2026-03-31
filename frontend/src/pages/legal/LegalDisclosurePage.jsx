import React from 'react';
import { motion } from 'framer-motion';
import HeaderHero from '../../components/HeaderHero';
import { useTranslation } from '../../locales';

const LegalDisclosurePage = () => {
    const { t } = useTranslation();

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
                        {t('legal.title')}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        {t('legal.subtitle')}
                    </p>
                </motion.div>

                {/* Company Information Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm border border-purple-100 p-6 sm:p-8 mb-8"
                >
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                        {t('legal.sections.companyInfo.title')}
                    </h2>
                    <div className="space-y-2 text-gray-600 text-sm sm:text-base">
                        <p className="font-medium text-gray-800 text-base sm:text-lg">{t('legal.sections.companyInfo.name')}</p>
                        <p className="text-gray-800 font-medium">{t('legal.sections.companyInfo.representedBy')}</p>
                        <p>{t('legal.sections.companyInfo.address')}</p>
                        <p>{t('legal.sections.companyInfo.city')}</p>
                        <div className="pt-2 space-y-1">
                            <p>{t('legal.sections.companyInfo.phone')}</p>
                            <p>{t('legal.sections.companyInfo.email')}</p>
                            <p>{t('legal.sections.companyInfo.vat')}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Other Sections */}
                <div className="space-y-8">
                    {['liabilityLinks', 'liabilityContent', 'copyright'].map((section, index) => (
                        <motion.div
                            key={section}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: (index + 2) * 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow duration-300"
                        >
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                                {t(`legal.sections.${section}.title`)}
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                {t(`legal.sections.${section}.content`)}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LegalDisclosurePage;
