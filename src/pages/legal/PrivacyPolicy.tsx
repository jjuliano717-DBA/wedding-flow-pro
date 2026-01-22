

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-32 max-w-4xl">
                <h1 className="font-serif text-4xl mb-8">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-slate max-w-none">
                    <p className="mb-6">
                        At 2PlanAWedding, accessible from 2planawedding.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by 2PlanAWedding and how we use it.
                    </p>

                    <h2 className="text-2xl font-serif mt-8 mb-4">1. Information We Collect</h2>
                    <p className="mb-4">
                        We collect information you provide directly to us when you register for an account, create a profile, or communicate with us.
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li><strong>Personal Information:</strong> Name, email address, phone number, and billing information.</li>
                        <li><strong>Wedding Details:</strong> Wedding date, location, budget, and preferences.</li>
                        <li><strong>Business Information:</strong> For vendors, we collect business names, descriptions, pricing, and service details.</li>
                    </ul>

                    <h2 className="text-2xl font-serif mt-8 mb-4">2. How We Use Your Information</h2>
                    <p className="mb-4">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Provide, operate, and maintain our website</li>
                        <li>Improve, personalize, and expand our website</li>
                        <li>Understand and analyze how you use our website</li>
                        <li>Develop new products, services, features, and functionality</li>
                        <li>Connect couples with relevant vendors and venues</li>
                        <li>Send you emails, including newsletters and updates</li>
                    </ul>

                    <h2 className="text-2xl font-serif mt-8 mb-4">3. Log Files</h2>
                    <p className="mb-6">
                        2PlanAWedding follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
                    </p>

                    <h2 className="text-2xl font-serif mt-8 mb-4">4. Third Party Privacy Policies</h2>
                    <p className="mb-6">
                        2PlanAWedding's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.
                    </p>

                    <h2 className="text-2xl font-serif mt-8 mb-4">5. GDPR Data Protection Rights</h2>
                    <p className="mb-4">
                        We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>The right to access – You have the right to request copies of your personal data.</li>
                        <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
                        <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
                    </ul>

                    <h2 className="text-2xl font-serif mt-8 mb-4">6. Contact Us</h2>
                    <p className="mb-6">
                        If you have any questions about our Privacy Policy, please contact us at support@2planawedding.com.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default PrivacyPolicy;
