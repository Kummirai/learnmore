import Link from "next/link"
import {LuArrowRight} from "react-icons/lu";

export default function Courses() {
    const courses = [
        {
            title: "Mathematics & Numeracy",
            description: "Building strong number sense, problem-solving skills, and logical thinking through fun activities.",
            duration: "Grade R - 3",
            students: 320,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "English Language & Literacy",
            description: "Developing reading, writing, speaking, and listening skills with engaging stories and exercises.",
            duration: "Grade R - 7",
            students: 480,
            color: "bg-purple-100 text-purple-600"
        },
        {
            title: "Science & Discovery",
            description: "Exploring the natural world through hands-on experiments, nature walks, and curious inquiry.",
            duration: "Grade 4 - 7",
            students: 210,
            color: "bg-cyan-100 text-cyan-600"
        },
        {
            title: "Creative Arts & Culture",
            description: "Expressing imagination through painting, music, drama, dance, and cultural celebrations.",
            duration: "Grade R - 7",
            students: 380,
            color: "bg-pink-100 text-pink-600"
        },
        {
            title: "Physical Education & Sport",
            description: "Building teamwork, coordination, and healthy habits through games, athletics, and play.",
            duration: "Grade R - 7",
            students: 450,
            color: "bg-orange-100 text-orange-600"
        },
        {
            title: "Life Skills & Social Studies",
            description: "Learning about our world, community, values, and becoming responsible young citizens.",
            duration: "Grade 1 - 7",
            students: 290,
            color: "bg-green-100 text-green-600"
        }
    ]

    return (
        <section className={"py-16 md:py-24 bg-gray-50 px-4"}>
            <div className={"max-w-6xl mx-auto"}>
                <div className={"text-center mb-12 md:mb-16"}>
                    <h4 className={"text-green-600 font-medium mb-3"}>OUR SUBJECTS</h4>
                    <h2 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>
                        A Rich Curriculum For <br className={"hidden sm:block"}/>
                        Every Stage
                    </h2>
                </div>
                <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}>
                    {courses.map((course, i) => (
                        <div key={i}
                             className={"bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"}>
                            <div
                                className={`inline-block px-3 py-1 rounded text-xs font-medium mb-4 ${course.color}`}>
                                {course.duration}
                            </div>
                            <h3 className={"text-lg font-semibold text-gray-800 mb-2"}>{course.title}</h3>
                            <p className={"text-gray-600 text-sm leading-relaxed mb-4"}>{course.description}</p>
                            <div className={"flex items-center justify-between"}>
                                <span className={"text-sm text-gray-500"}>{course.students} Learners</span>
                                <Link href={"/subjects"}
                                      className={"text-green-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"}>
                                    Learn More <LuArrowRight/>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
