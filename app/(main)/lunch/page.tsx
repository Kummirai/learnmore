import Link from "next/link"
import {LuArrowLeft, LuUtensils} from "react-icons/lu"

type Meal = {day: string; options: string[]}

const lunchMenu: Meal[] = [
    {
        day: "Monday",
        options: ["Grilled chicken wraps with salad", "Vegetable pasta with cheese sauce", "Sandwich bar: ham & cheese / jam", "Fresh fruit cup"],
    },
    {
        day: "Tuesday",
        options: ["Beef stew with rice and vegetables", "Egg & chips with baked beans", "Sandwich bar: tuna mayo / cheese", "Yoghurt & granola"],
    },
    {
        day: "Wednesday",
        options: ["Fish fingers with mashed potato & peas", "Macaroni & cheese with garlic bread", "Sandwich bar: egg salad / chicken mayo", "Fruit juice & biscuit"],
    },
    {
        day: "Thursday",
        options: ["Chicken curry with rice & sambals", "Vegetable stir-fry with noodles", "Sandwich bar: beef / cheese & tomato", "Cupcake of the week"],
    },
    {
        day: "Friday",
        options: ["Pizza slice with side salad", "Hot dog with chips", "Sandwich bar: assorted fillings", "Ice cream treat"],
    },
]

export default function LunchPage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"text-center mb-12"}>
                    <div className={"flex items-center justify-center gap-3 mb-3"}>
                        <LuUtensils className={"text-3xl text-green-600"}/>
                        <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>Lunch Menu</h1>
                    </div>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>
                        Weekly lunch options available from our school kitchen. Menu rotates each term.
                    </p>
                </div>

                <div className={"grid grid-cols-1 md:grid-cols-5 gap-4"}>
                    {lunchMenu.map(day => (
                        <div key={day.day}
                             className={"bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"}>
                            <div className={"bg-green-600 text-white text-center py-3 font-semibold"}>{day.day}</div>
                            <div className={"p-4 space-y-2"}>
                                {day.options.map((opt, j) => (
                                    <div key={j}
                                         className={"text-sm text-gray-700 bg-gray-50 rounded p-2 border border-gray-100"}>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={"mt-8 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800"}>
                    <strong>All meals include:</strong> A choice of water or juice. Special dietary requirements
                    (halal, vegetarian, allergies) can be accommodated — please notify the school office.
                    <br/>
                    <strong>Price:</strong> R35 per meal or R150 per week. Pre-order at the admin office.
                </div>
            </div>
        </section>
    )
}
