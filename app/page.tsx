import Hero from "@/components/Hero"
import Learn from "@/components/Learn";
import Stats from "@/components/Stats";
import Courses from "@/components/Courses";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <>
            <Hero/>
            <Learn/>
            <Stats/>
            <Courses/>
            <Team/>
            <Testimonials/>
            <Footer/>
        </>
    );
}
