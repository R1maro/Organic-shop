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
import Navbar from '../../components/Navbar/Index';

const HomePage = () => {
    return (
        <div>
            <Navbar/>
            <main>
                {/* Add your page content here */}
                <h1>Welcome to Thunder-dev!</h1>
            </main>
        </div>
    );
};

export default HomePage;




