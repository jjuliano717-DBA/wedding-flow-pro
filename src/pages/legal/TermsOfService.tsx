

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-32 max-w-4xl">
                <h1 className="font-serif text-4xl mb-8">Terms of Service</h1>
                <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-slate max-w-none">
                    <p className="mb-6">
                        Welcome to 2PlanAWedding! These terms and conditions outline the rules and regulations for the use of 2PlanAWedding's Website, located at 2planawedding.com.
                    </p>

                    <h2 className="text-2xl font-serif mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="mb-6">
                        By accessing this website we assume you accept these terms and conditions. Do not continue to use 2PlanAWedding if you do not agree to take all of the terms and conditions stated on this page.
                    </p>

                    <h2 className="text-2xl font-serif mt-8 mb-4">2. Cookies</h2>
                    <p className="mb-6">
                        We employ the use of cookies. By accessing 2PlanAWedding, you agreed to use cookies in agreement with the 2PlanAWedding's Privacy Policy.
                    </p>

                    <h2 className="text-2xl font-serif mt-8 mb-4">3. License</h2>
                    <p className="mb-6">
                        Unless otherwise stated, 2PlanAWedding and/or its licensors own the intellectual property rights for all material on 2PlanAWedding. All intellectual property rights are reserved. You may access this from 2PlanAWedding for your own personal use subjected to restrictions set in these terms and conditions.
                    </p>

                    <h2 className="text-2xl font-serif mt-8 mb-4">4. User Account</h2>
                    <p className="mb-6">
                        If you create an account on the Website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it.
                    </p>

                    <h2 className="text-2xl font-serif mt-8 mb-4">5. Vendor Services</h2>
                    <p className="mb-6">
                        Vendors and Venues listed on 2PlanAWedding are independent entities. We are not responsible for the quality, safety, or legality of the services provided by vendors listed on our platform. All transactions and agreements are directly between the Couple and the Vendor.
                    </p>

                    <h2 className="text-2xl font-serif mt-8 mb-4">6. Content Liability</h2>
                    <p className="mb-6">
                        We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
                    </p>

                    <h2 className="text-2xl font-serif mt-8 mb-4">7. Termination</h2>
                    <p className="mb-6">
                        We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                    </p>

                    <h2 className="text-2xl font-serif mt-8 mb-4">8. Governing Law</h2>
                    <p className="mb-6">
                        These Terms shall be governed and construed in accordance with the laws of United States, without regard to its conflict of law provisions.
                    </p>

                    <h2 className="text-2xl font-serif mt-8 mb-4">9. Contact Us</h2>
                    <p className="mb-6">
                        If you have any questions about these Terms, please contact us at support@2planawedding.com.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default TermsOfService;
