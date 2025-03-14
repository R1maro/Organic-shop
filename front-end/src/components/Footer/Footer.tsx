const Footer = async () => {

    return (

        <footer>
            <div className="footer-content">
                <div className="footer-section">
                    <h3>About Us</h3>
                    <p>We are a leading company in our industry, committed to providing top-notch services and products
                        to our clients worldwide.</p>
                </div>
                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <p>Email: info@yourcompany.com</p>
                    <p>Phone: +1 (555) 123-4567</p>
                    <div className="social-media">
                        <a href="https://linkedin.com" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40"
                                 viewBox="0 0 48 48">
                                <path fill="#0078d4"
                                      d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5	V37z"></path>
                                <path
                                    d="M30,37V26.901c0-1.689-0.819-2.698-2.192-2.698c-0.815,0-1.414,0.459-1.779,1.364	c-0.017,0.064-0.041,0.325-0.031,1.114L26,37h-7V18h7v1.061C27.022,18.356,28.275,18,29.738,18c4.547,0,7.261,3.093,7.261,8.274	L37,37H30z M11,37V18h3.457C12.454,18,11,16.528,11,14.499C11,12.472,12.478,11,14.514,11c2.012,0,3.445,1.431,3.486,3.479	C18,16.523,16.521,18,14.485,18H18v19H11z"
                                    opacity=".05"></path>
                                <path
                                    d="M30.5,36.5v-9.599c0-1.973-1.031-3.198-2.692-3.198c-1.295,0-1.935,0.912-2.243,1.677	c-0.082,0.199-0.071,0.989-0.067,1.326L25.5,36.5h-6v-18h6v1.638c0.795-0.823,2.075-1.638,4.238-1.638	c4.233,0,6.761,2.906,6.761,7.774L36.5,36.5H30.5z M11.5,36.5v-18h6v18H11.5z M14.457,17.5c-1.713,0-2.957-1.262-2.957-3.001	c0-1.738,1.268-2.999,3.014-2.999c1.724,0,2.951,1.229,2.986,2.989c0,1.749-1.268,3.011-3.015,3.011H14.457z"
                                    opacity=".07"></path>
                                <path fill="#fff"
                                      d="M12,19h5v17h-5V19z M14.485,17h-0.028C12.965,17,12,15.888,12,14.499C12,13.08,12.995,12,14.514,12	c1.521,0,2.458,1.08,2.486,2.499C17,15.887,16.035,17,14.485,17z M36,36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698	c-1.501,0-2.313,1.012-2.707,1.99C24.957,25.543,25,26.511,25,27v9h-5V19h5v2.616C25.721,20.5,26.85,19,29.738,19	c3.578,0,6.261,2.25,6.261,7.274L36,36L36,36z"></path>
                            </svg>
                        </a>
                        <a href="https://instagram.com" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40"
                                 viewBox="0 0 48 48">
                                <radialGradient id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1" cx="19.38" cy="42.035"
                                                r="44.899" gradientUnits="userSpaceOnUse">
                                    <stop offset="0" stopColor="#fd5"></stop>
                                    <stop offset=".328" stopColor="#ff543f"></stop>
                                    <stop offset=".348" stopColor="#fc5245"></stop>
                                    <stop offset=".504" stopColor="#e64771"></stop>
                                    <stop offset=".643" stopColor="#d53e91"></stop>
                                    <stop offset=".761" stopColor="#cc39a4"></stop>
                                    <stop offset=".841" stopColor="#c837ab"></stop>
                                </radialGradient>
                                <path fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)"
                                      d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path>
                                <radialGradient id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2" cx="11.786" cy="5.54"
                                                r="29.813" gradientTransform="matrix(1 0 0 .6663 0 1.849)"
                                                gradientUnits="userSpaceOnUse">
                                    <stop offset="0" stopColor="#4168c9"></stop>
                                    <stop offset=".999" stopColor="#4168c9" stopOpacity="0"></stop>
                                </radialGradient>
                                <path fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)"
                                      d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path>
                                <path fill="#fff"
                                      d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"></path>
                                <circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle>
                                <path fill="#fff"
                                      d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"></path>
                            </svg>
                        </a>
                        <a href="https://twitter.com" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="37" height="37"
                                 viewBox="0 0 50 50">
                                <path
                                    d="M 11 4 C 7.1456661 4 4 7.1456661 4 11 L 4 39 C 4 42.854334 7.1456661 46 11 46 L 39 46 C 42.854334 46 46 42.854334 46 39 L 46 11 C 46 7.1456661 42.854334 4 39 4 L 11 4 z M 11 6 L 39 6 C 41.773666 6 44 8.2263339 44 11 L 44 39 C 44 41.773666 41.773666 44 39 44 L 11 44 C 8.2263339 44 6 41.773666 6 39 L 6 11 C 6 8.2263339 8.2263339 6 11 6 z M 13.085938 13 L 22.308594 26.103516 L 13 37 L 15.5 37 L 23.4375 27.707031 L 29.976562 37 L 37.914062 37 L 27.789062 22.613281 L 36 13 L 33.5 13 L 26.660156 21.009766 L 21.023438 13 L 13.085938 13 z M 16.914062 15 L 19.978516 15 L 34.085938 35 L 31.021484 35 L 16.914062 15 z"></path>
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="footer-section">
                    <h3>Visit Us</h3>
                    <div className="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3233.948084631655!2d50.95797887637352!3d35.85027652066848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8dbec562e117dd%3A0x568083a4a623e524!2sEnghelab%20Stadium!5e0!3m2!1sen!2sus!4v1741627196152!5m2!1sen!2sus"
                            width="100%" height="100%" loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
                <div className="footer-section newsletter">
                    <h3>Newsletter</h3>
                    <p>Subscribe to our newsletter to stay updated on our latest news and offers.</p>
                    <input type="email" placeholder="Enter your email" required/>
                    <button type="submit">Subscribe</button>
                </div>
            </div>
            <div className="flex justify-center mt-6">
                <p>&copy; <span id="year"></span> Your Company Name. All rights reserved.</p>
            </div>
        </footer>
    )
};

export default Footer;