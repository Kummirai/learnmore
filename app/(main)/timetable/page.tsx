"use client"

import {LuClock} from "react-icons/lu"
import {useState} from "react"

type DaySlot = {time: string; subject: string; teacher: string; room: string}
type DaySchedule = {day: string; slots: DaySlot[]}

const grades = ["R", "1", "2", "3", "4", "5", "6", "7"]
const classes = ["A", "B", "C"]

const baseSlots: DaySlot[] = [
    {time: "08:00 - 08:45", subject: "—", teacher: "—", room: "—"},
    {time: "08:45 - 09:30", subject: "—", teacher: "—", room: "—"},
    {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
    {time: "10:00 - 10:45", subject: "—", teacher: "—", room: "—"},
    {time: "10:45 - 11:30", subject: "—", teacher: "—", room: "—"},
    {time: "11:30 - 12:15", subject: "—", teacher: "—", room: "—"},
    {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
    {time: "13:00 - 13:45", subject: "—", teacher: "—", room: "—"},
]

const timetables: Record<string, Record<string, DaySchedule[]>> = {
    R: {
        A: [
            {day: "Monday", slots: [
                {time: "08:00 - 08:45", subject: "Ring Time", teacher: "Ms. Naidoo", room: "R1"},
                {time: "08:45 - 09:30", subject: "Free Play", teacher: "Ms. Naidoo", room: "R1"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Life Skills", teacher: "Ms. Naidoo", room: "R1"},
                {time: "10:45 - 11:30", subject: "Music & Movement", teacher: "Ms. Ferreira", room: "Music Room"},
                {time: "11:30 - 12:15", subject: "Story Time", teacher: "Ms. Naidoo", room: "R1"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Outdoor Play", teacher: "Ms. Naidoo", room: "Playground"},
            ]},
            {day: "Tuesday", slots: [
                {time: "08:00 - 08:45", subject: "Ring Time", teacher: "Ms. Naidoo", room: "R1"},
                {time: "08:45 - 09:30", subject: "Creative Arts", teacher: "Ms. Naidoo", room: "R1"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Numeracy", teacher: "Ms. Naidoo", room: "R1"},
                {time: "10:45 - 11:30", subject: "Library", teacher: "Ms. Govender", room: "Library"},
                {time: "11:30 - 12:15", subject: "Show & Tell", teacher: "Ms. Naidoo", room: "R1"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Free Play", teacher: "Ms. Naidoo", room: "R1"},
            ]},
            {day: "Wednesday", slots: [
                {time: "08:00 - 08:45", subject: "Ring Time", teacher: "Ms. Naidoo", room: "R1"},
                {time: "08:45 - 09:30", subject: "Perceptual Skills", teacher: "Ms. Naidoo", room: "R1"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Life Skills", teacher: "Ms. Naidoo", room: "R1"},
                {time: "10:45 - 11:30", subject: "Physical Education", teacher: "Coach Singh", room: "Field"},
                {time: "11:30 - 12:15", subject: "Music & Movement", teacher: "Ms. Ferreira", room: "Music Room"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Fantasy Play", teacher: "Ms. Naidoo", room: "R1"},
            ]},
            {day: "Thursday", slots: [
                {time: "08:00 - 08:45", subject: "Ring Time", teacher: "Ms. Naidoo", room: "R1"},
                {time: "08:45 - 09:30", subject: "Numeracy", teacher: "Ms. Naidoo", room: "R1"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Creative Arts", teacher: "Ms. Naidoo", room: "R1"},
                {time: "10:45 - 11:30", subject: "Life Skills", teacher: "Ms. Naidoo", room: "R1"},
                {time: "11:30 - 12:15", subject: "Free Play", teacher: "Ms. Naidoo", room: "R1"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Outdoor Play", teacher: "Ms. Naidoo", room: "Playground"},
            ]},
            {day: "Friday", slots: [
                {time: "08:00 - 08:45", subject: "Ring Time", teacher: "Ms. Naidoo", room: "R1"},
                {time: "08:45 - 09:30", subject: "Life Skills", teacher: "Ms. Naidoo", room: "R1"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Assembly", teacher: "Principal", room: "Hall"},
                {time: "10:45 - 11:30", subject: "Perceptual Skills", teacher: "Ms. Naidoo", room: "R1"},
                {time: "11:30 - 12:15", subject: "Show & Tell", teacher: "Ms. Naidoo", room: "R1"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Free Play", teacher: "Ms. Naidoo", room: "R1"},
            ]},
        ],
        B: [
            {day: "Monday", slots: [
                {time: "08:00 - 08:45", subject: "Ring Time", teacher: "Ms. Zulu", room: "R2"},
                {time: "08:45 - 09:30", subject: "Free Play", teacher: "Ms. Zulu", room: "R2"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Life Skills", teacher: "Ms. Zulu", room: "R2"},
                {time: "10:45 - 11:30", subject: "Library", teacher: "Ms. Govender", room: "Library"},
                {time: "11:30 - 12:15", subject: "Story Time", teacher: "Ms. Zulu", room: "R2"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Outdoor Play", teacher: "Ms. Zulu", room: "Playground"},
            ]},
            {day: "Tuesday", slots: [
                {time: "08:00 - 08:45", subject: "Ring Time", teacher: "Ms. Zulu", room: "R2"},
                {time: "08:45 - 09:30", subject: "Creative Arts", teacher: "Ms. Zulu", room: "R2"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Numeracy", teacher: "Ms. Zulu", room: "R2"},
                {time: "10:45 - 11:30", subject: "Music & Movement", teacher: "Ms. Ferreira", room: "Music Room"},
                {time: "11:30 - 12:15", subject: "Show & Tell", teacher: "Ms. Zulu", room: "R2"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Free Play", teacher: "Ms. Zulu", room: "R2"},
            ]},
            {day: "Wednesday", slots: [
                {time: "08:00 - 08:45", subject: "Ring Time", teacher: "Ms. Zulu", room: "R2"},
                {time: "08:45 - 09:30", subject: "Perceptual Skills", teacher: "Ms. Zulu", room: "R2"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Life Skills", teacher: "Ms. Zulu", room: "R2"},
                {time: "10:45 - 11:30", subject: "Physical Education", teacher: "Coach Singh", room: "Field"},
                {time: "11:30 - 12:15", subject: "Free Play", teacher: "Ms. Zulu", room: "R2"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Fantasy Play", teacher: "Ms. Zulu", room: "R2"},
            ]},
            {day: "Thursday", slots: [
                {time: "08:00 - 08:45", subject: "Ring Time", teacher: "Ms. Zulu", room: "R2"},
                {time: "08:45 - 09:30", subject: "Numeracy", teacher: "Ms. Zulu", room: "R2"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Creative Arts", teacher: "Ms. Zulu", room: "R2"},
                {time: "10:45 - 11:30", subject: "Life Skills", teacher: "Ms. Zulu", room: "R2"},
                {time: "11:30 - 12:15", subject: "Story Time", teacher: "Ms. Zulu", room: "R2"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Free Play", teacher: "Ms. Zulu", room: "R2"},
            ]},
            {day: "Friday", slots: [
                {time: "08:00 - 08:45", subject: "Ring Time", teacher: "Ms. Zulu", room: "R2"},
                {time: "08:45 - 09:30", subject: "Life Skills", teacher: "Ms. Zulu", room: "R2"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Assembly", teacher: "Principal", room: "Hall"},
                {time: "10:45 - 11:30", subject: "Perceptual Skills", teacher: "Ms. Zulu", room: "R2"},
                {time: "11:30 - 12:15", subject: "Music & Movement", teacher: "Ms. Ferreira", room: "Music Room"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Free Play", teacher: "Ms. Zulu", room: "R2"},
            ]},
        ],
        C: [
            {day: "Monday", slots: [
                {time: "08:00 - 08:45", subject: "Ring Time", teacher: "Ms. Botha", room: "R3"},
                {time: "08:45 - 09:30", subject: "Free Play", teacher: "Ms. Botha", room: "R3"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Life Skills", teacher: "Ms. Botha", room: "R3"},
                {time: "10:45 - 11:30", subject: "Music & Movement", teacher: "Ms. Ferreira", room: "Music Room"},
                {time: "11:30 - 12:15", subject: "Show & Tell", teacher: "Ms. Botha", room: "R3"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Outdoor Play", teacher: "Ms. Botha", room: "Playground"},
            ]},
            {day: "Tuesday", slots: [
                {time: "08:00 - 08:45", subject: "Ring Time", teacher: "Ms. Botha", room: "R3"},
                {time: "08:45 - 09:30", subject: "Numeracy", teacher: "Ms. Botha", room: "R3"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Creative Arts", teacher: "Ms. Botha", room: "R3"},
                {time: "10:45 - 11:30", subject: "Library", teacher: "Ms. Govender", room: "Library"},
                {time: "11:30 - 12:15", subject: "Story Time", teacher: "Ms. Botha", room: "R3"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Free Play", teacher: "Ms. Botha", room: "R3"},
            ]},
            {day: "Wednesday", slots: [
                {time: "08:00 - 08:45", subject: "Ring Time", teacher: "Ms. Botha", room: "R3"},
                {time: "08:45 - 09:30", subject: "Perceptual Skills", teacher: "Ms. Botha", room: "R3"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Life Skills", teacher: "Ms. Botha", room: "R3"},
                {time: "10:45 - 11:30", subject: "Physical Education", teacher: "Coach Singh", room: "Field"},
                {time: "11:30 - 12:15", subject: "Music & Movement", teacher: "Ms. Botha", room: "R3"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Fantasy Play", teacher: "Ms. Botha", room: "R3"},
            ]},
            {day: "Thursday", slots: [
                {time: "08:00 - 08:45", subject: "Ring Time", teacher: "Ms. Botha", room: "R3"},
                {time: "08:45 - 09:30", subject: "Numeracy", teacher: "Ms. Botha", room: "R3"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Creative Arts", teacher: "Ms. Botha", room: "R3"},
                {time: "10:45 - 11:30", subject: "Life Skills", teacher: "Ms. Botha", room: "R3"},
                {time: "11:30 - 12:15", subject: "Free Play", teacher: "Ms. Botha", room: "R3"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Outdoor Play", teacher: "Ms. Botha", room: "Playground"},
            ]},
            {day: "Friday", slots: [
                {time: "08:00 - 08:45", subject: "Ring Time", teacher: "Ms. Botha", room: "R3"},
                {time: "08:45 - 09:30", subject: "Life Skills", teacher: "Ms. Botha", room: "R3"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Assembly", teacher: "Principal", room: "Hall"},
                {time: "10:45 - 11:30", subject: "Perceptual Skills", teacher: "Ms. Botha", room: "R3"},
                {time: "11:30 - 12:15", subject: "Story Time", teacher: "Ms. Botha", room: "R3"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Free Play", teacher: "Ms. Botha", room: "R3"},
            ]},
        ],
    },
    "4": {
        A: [
            {day: "Monday", slots: [
                {time: "08:00 - 08:45", subject: "Mathematics", teacher: "Ms. Dlamini", room: "101"},
                {time: "08:45 - 09:30", subject: "English", teacher: "Mr. Botha", room: "102"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Life Skills", teacher: "Ms. Nkosi", room: "103"},
                {time: "10:45 - 11:30", subject: "Afrikaans", teacher: "Ms. van der Merwe", room: "104"},
                {time: "11:30 - 12:15", subject: "Creative Arts", teacher: "Mr. Jacobs", room: "Art Room"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Physical Education", teacher: "Coach Singh", room: "Field"},
            ]},
            {day: "Tuesday", slots: [
                {time: "08:00 - 08:45", subject: "English", teacher: "Mr. Botha", room: "102"},
                {time: "08:45 - 09:30", subject: "Mathematics", teacher: "Ms. Dlamini", room: "101"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Science", teacher: "Mr. Naidoo", room: "Lab"},
                {time: "10:45 - 11:30", subject: "Geography", teacher: "Ms. Nkosi", room: "103"},
                {time: "11:30 - 12:15", subject: "Music", teacher: "Ms. Ferreira", room: "Music Room"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Library", teacher: "Ms. Govender", room: "Library"},
            ]},
            {day: "Wednesday", slots: [
                {time: "08:00 - 08:45", subject: "Mathematics", teacher: "Ms. Dlamini", room: "101"},
                {time: "08:45 - 09:30", subject: "Afrikaans", teacher: "Ms. van der Merwe", room: "104"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "English", teacher: "Mr. Botha", room: "102"},
                {time: "10:45 - 11:30", subject: "Life Skills", teacher: "Ms. Nkosi", room: "103"},
                {time: "11:30 - 12:15", subject: "Computers", teacher: "Mr. Naidoo", room: "Computer Lab"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Sport", teacher: "Coach Singh", room: "Field"},
            ]},
            {day: "Thursday", slots: [
                {time: "08:00 - 08:45", subject: "Science", teacher: "Mr. Naidoo", room: "Lab"},
                {time: "08:45 - 09:30", subject: "Mathematics", teacher: "Ms. Dlamini", room: "101"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "English", teacher: "Mr. Botha", room: "102"},
                {time: "10:45 - 11:30", subject: "Creative Arts", teacher: "Mr. Jacobs", room: "Art Room"},
                {time: "11:30 - 12:15", subject: "History", teacher: "Ms. Nkosi", room: "103"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Choir", teacher: "Ms. Ferreira", room: "Music Room"},
            ]},
            {day: "Friday", slots: [
                {time: "08:00 - 08:45", subject: "Mathematics", teacher: "Ms. Dlamini", room: "101"},
                {time: "08:45 - 09:30", subject: "English", teacher: "Mr. Botha", room: "102"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Assembly", teacher: "Principal", room: "Hall"},
                {time: "10:45 - 11:30", subject: "Life Skills", teacher: "Ms. Nkosi", room: "103"},
                {time: "11:30 - 12:15", subject: "Free Period / Remedial", teacher: "Various", room: "—"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Sport", teacher: "Coach Singh", room: "Field"},
            ]},
        ],
        B: [
            {day: "Monday", slots: [
                {time: "08:00 - 08:45", subject: "Mathematics", teacher: "Mr. Khumalo", room: "105"},
                {time: "08:45 - 09:30", subject: "English", teacher: "Ms. Peters", room: "106"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Science", teacher: "Mr. Naidoo", room: "Lab"},
                {time: "10:45 - 11:30", subject: "Afrikaans", teacher: "Ms. van der Merwe", room: "104"},
                {time: "11:30 - 12:15", subject: "Life Skills", teacher: "Ms. Nkosi", room: "103"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Creative Arts", teacher: "Mr. Jacobs", room: "Art Room"},
            ]},
            {day: "Tuesday", slots: [
                {time: "08:00 - 08:45", subject: "English", teacher: "Ms. Peters", room: "106"},
                {time: "08:45 - 09:30", subject: "Mathematics", teacher: "Mr. Khumalo", room: "105"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Afrikaans", teacher: "Ms. van der Merwe", room: "104"},
                {time: "10:45 - 11:30", subject: "Geography", teacher: "Ms. Nkosi", room: "103"},
                {time: "11:30 - 12:15", subject: "Computers", teacher: "Mr. Naidoo", room: "Computer Lab"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Library", teacher: "Ms. Govender", room: "Library"},
            ]},
            {day: "Wednesday", slots: [
                {time: "08:00 - 08:45", subject: "Mathematics", teacher: "Mr. Khumalo", room: "105"},
                {time: "08:45 - 09:30", subject: "English", teacher: "Ms. Peters", room: "106"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Science", teacher: "Mr. Naidoo", room: "Lab"},
                {time: "10:45 - 11:30", subject: "Life Skills", teacher: "Ms. Nkosi", room: "103"},
                {time: "11:30 - 12:15", subject: "Music", teacher: "Ms. Ferreira", room: "Music Room"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Sport", teacher: "Coach Singh", room: "Field"},
            ]},
            {day: "Thursday", slots: [
                {time: "08:00 - 08:45", subject: "English", teacher: "Ms. Peters", room: "106"},
                {time: "08:45 - 09:30", subject: "Mathematics", teacher: "Mr. Khumalo", room: "105"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Creative Arts", teacher: "Mr. Jacobs", room: "Art Room"},
                {time: "10:45 - 11:30", subject: "History", teacher: "Ms. Nkosi", room: "103"},
                {time: "11:30 - 12:15", subject: "Afrikaans", teacher: "Ms. van der Merwe", room: "104"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Physical Education", teacher: "Coach Singh", room: "Field"},
            ]},
            {day: "Friday", slots: [
                {time: "08:00 - 08:45", subject: "Mathematics", teacher: "Mr. Khumalo", room: "105"},
                {time: "08:45 - 09:30", subject: "English", teacher: "Ms. Peters", room: "106"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Assembly", teacher: "Principal", room: "Hall"},
                {time: "10:45 - 11:30", subject: "Life Skills", teacher: "Ms. Nkosi", room: "103"},
                {time: "11:30 - 12:15", subject: "Free Period / Remedial", teacher: "Various", room: "—"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Choir", teacher: "Ms. Ferreira", room: "Music Room"},
            ]},
        ],
        C: [
            {day: "Monday", slots: [
                {time: "08:00 - 08:45", subject: "Mathematics", teacher: "Ms. Chetty", room: "107"},
                {time: "08:45 - 09:30", subject: "English", teacher: "Mr. Botha", room: "102"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Science", teacher: "Mr. Naidoo", room: "Lab"},
                {time: "10:45 - 11:30", subject: "Life Skills", teacher: "Ms. Nkosi", room: "103"},
                {time: "11:30 - 12:15", subject: "Music", teacher: "Ms. Ferreira", room: "Music Room"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Creative Arts", teacher: "Mr. Jacobs", room: "Art Room"},
            ]},
            {day: "Tuesday", slots: [
                {time: "08:00 - 08:45", subject: "English", teacher: "Mr. Botha", room: "102"},
                {time: "08:45 - 09:30", subject: "Mathematics", teacher: "Ms. Chetty", room: "107"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Afrikaans", teacher: "Ms. van der Merwe", room: "104"},
                {time: "10:45 - 11:30", subject: "Geography", teacher: "Ms. Nkosi", room: "103"},
                {time: "11:30 - 12:15", subject: "Computers", teacher: "Mr. Naidoo", room: "Computer Lab"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Library", teacher: "Ms. Govender", room: "Library"},
            ]},
            {day: "Wednesday", slots: [
                {time: "08:00 - 08:45", subject: "Mathematics", teacher: "Ms. Chetty", room: "107"},
                {time: "08:45 - 09:30", subject: "Afrikaans", teacher: "Ms. van der Merwe", room: "104"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "English", teacher: "Mr. Botha", room: "102"},
                {time: "10:45 - 11:30", subject: "Life Skills", teacher: "Ms. Nkosi", room: "103"},
                {time: "11:30 - 12:15", subject: "History", teacher: "Ms. Nkosi", room: "103"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Physical Education", teacher: "Coach Singh", room: "Field"},
            ]},
            {day: "Thursday", slots: [
                {time: "08:00 - 08:45", subject: "English", teacher: "Mr. Botha", room: "102"},
                {time: "08:45 - 09:30", subject: "Mathematics", teacher: "Ms. Chetty", room: "107"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Science", teacher: "Mr. Naidoo", room: "Lab"},
                {time: "10:45 - 11:30", subject: "Creative Arts", teacher: "Mr. Jacobs", room: "Art Room"},
                {time: "11:30 - 12:15", subject: "Afrikaans", teacher: "Ms. van der Merwe", room: "104"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Choir", teacher: "Ms. Ferreira", room: "Music Room"},
            ]},
            {day: "Friday", slots: [
                {time: "08:00 - 08:45", subject: "Mathematics", teacher: "Ms. Chetty", room: "107"},
                {time: "08:45 - 09:30", subject: "English", teacher: "Mr. Botha", room: "102"},
                {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
                {time: "10:00 - 10:45", subject: "Assembly", teacher: "Principal", room: "Hall"},
                {time: "10:45 - 11:30", subject: "Sport", teacher: "Coach Singh", room: "Field"},
                {time: "11:30 - 12:15", subject: "Free Period / Remedial", teacher: "Various", room: "—"},
                {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
                {time: "13:00 - 13:45", subject: "Life Skills", teacher: "Ms. Nkosi", room: "103"},
            ]},
        ],
    },
}

function getTimetable(grade: string, classId: string): DaySchedule[] {
    if (timetables[grade]?.[classId]) return timetables[grade][classId]

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    return days.map(day => ({
        day,
        slots: baseSlots.map(s => s.subject === "—"
            ? {...s, subject: "TBC", teacher: "—", room: "—"}
            : {...s}
        ),
    }))
}

export default function TimetablePage() {
    const [grade, setGrade] = useState("4")
    const [classId, setClassId] = useState("A")

    const schedule = getTimetable(grade, classId)

    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <div className={"text-center mb-8"}>
                    <div className={"flex items-center justify-center gap-3 mb-3"}>
                        <LuClock className={"text-3xl text-cyan"}/>
                        <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>Weekly Timetable</h1>
                    </div>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>
                        Select a grade and class to view their weekly schedule.
                    </p>
                </div>

                <div className={"flex flex-col items-center gap-4 mb-10"}>
                    <div className={"flex flex-wrap items-center justify-center gap-2"}>
                        {grades.map(g => (
                            <button key={g} onClick={() => { setGrade(g); setClassId("A") }}
                                    className={`px-5 py-3 min-h-11 rounded-lg text-sm font-medium transition-colors ${
                                        grade === g
                                            ? "bg-navy text-white shadow-md"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}>
                                Grade {g}
                            </button>
                        ))}
                    </div>
                    <div className={"flex items-center gap-2"}>
                        <span className={"text-sm text-gray-500 mr-1"}>Class:</span>
                        {classes.map(c => (
                            <button key={c} onClick={() => setClassId(c)}
                                    className={`px-4 py-3 min-h-11 rounded-lg text-sm font-medium transition-colors ${
                                        classId === c
                                            ? "bg-ice-blue text-navy-dark border border-cyan-dark"
                                            : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
                                    }`}>
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={"grid grid-cols-1 md:grid-cols-5 gap-4"}>
                    {schedule.map(day => (
                        <div key={day.day}
                             className={"bg-white rounded-xl border border-gray-200 overflow-hidden"}>
                            <div className={"bg-navy text-white text-center py-3 font-semibold text-lg"}>
                                {day.day}
                            </div>
                            <div className={"p-3 space-y-2"}>
                                {day.slots.map((slot, i) => (
                                    <div key={i}
                                         className={`text-sm p-2 rounded ${slot.subject === "Break" || slot.subject === "Lunch" ? "bg-amber-50 border border-amber-200" : "bg-gray-50"}`}>
                                        <div className={"font-medium text-gray-700"}>{slot.time}</div>
                                        <div className={"font-semibold text-gray-800"}>{slot.subject}</div>
                                        {slot.teacher !== "—" && (
                                            <div className={"text-gray-500 text-xs"}>{slot.teacher} &middot; {slot.room}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
