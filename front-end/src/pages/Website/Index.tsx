// import {useNavigate} from 'react-router-dom';

// const Index = () => {
//     const navigate = useNavigate();
//
//     return (
//         <div className="text-center py-16">
//             <h1 className="text-4xl font-bold mb-4">Welcome to Organic Shop</h1>
//             <p className="text-lg mb-8">Discover the best deals on organic products.</p>
//             <button
//                 className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded"
//                 onClick={() => navigate('/auth/signin')}
//             >
//                 Sign In
//             </button>
//             <button
//                 className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 mx-2 rounded"
//                 onClick={() => navigate('/dashboard')}
//             >
//                 Dashboard
//             </button>
//         </div>
//     );
// };
import Navbar from '../../components/Navbar/Navbar';
import Slider from '../../components/Hero/Slider';
import Cover from '../../images/cover/cover-01.png';
import Organic from '../../images/cover/organic.jpg';

const slides = [
    Cover,
    Organic,
    'https://via.placeholder.com/800x400/3357FF/FFFFFF?text=Slide+3',
];

const HomePage = () => {
    return (
        <div dir="rtl">
            <Navbar/>
            <main>
                <div>
                    <Slider slides={slides}/>
                </div>
                <div className="container">
                    <span className="flex justify-end font-bold">
                        محصولات پرفروش
                    </span>
                </div>
            </main>
        </div>
    );
};

export default HomePage;




