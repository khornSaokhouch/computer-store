import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";

const UserLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="px-20" >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default UserLayout;
