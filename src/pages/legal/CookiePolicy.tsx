

const CookiePolicy = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-32 max-w-4xl">
                <h1 className="font-serif text-4xl mb-8">Cookie Policy</h1>
                <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-slate max-w-none">
                    <p className="mb-6">
                        This is the Cookie Policy for 2PlanAWedding, accessible from 2planawedding.com.
                    </p>

                    <h2 className="text-2xl font-serif mt-8 mb-4">What Are Cookies</h2>
                    <p className="mb-6">
                        As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the sites functionality.
                    </p>

                    <h2 className="text-2xl font-serif mt-8 mb-4">How We Use Cookies</h2>
                    <p className="mb-6">
                        We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
                    </p>

                    <h2 className="text-2xl font-serif mt-8 mb-4">The Cookies We Set</h2>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>
                            <strong>Account related cookies:</strong> If you create an account with us then we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out however in some cases they may remain afterwards to remember your site preferences when logged out.
                        </li>
                        <li>
                            <strong>Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.
                        </li>
                        <li>
                            <strong>Site preferences cookies:</strong> In order to provide you with a great experience on this site we provide the functionality to set your preferences for how this site runs when you use it. In order to remember your preferences we need to set cookies so that this information can be called whenever you interact with a page is affected by your preferences.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-serif mt-8 mb-4">Third Party Cookies</h2>
                    <p className="mb-6">
                        In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>
                            This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-serif mt-8 mb-4">More Information</h2>
                    <p className="mb-6">
                        Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
                    </p>
                    <p className="mb-6">
                        For more general information on cookies, please read the "Cookies" article from the Privacy Policy Generator.
                    </p>
                    <p className="mb-6">
                        However if you are still looking for more information then you can contact us through one of our preferred contact methods:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Email: support@2planawedding.com</li>
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default CookiePolicy;
