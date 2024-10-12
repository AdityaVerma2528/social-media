import { AiFillHome } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { BsCameraReels } from "react-icons/bs";
import { FiMessageSquare } from "react-icons/fi";
import { IoMdCreate } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";

export default function Navbar() {
    return (
        <div className="w-64 p-10 bg-slate-600">
            <div className="mb-4 text-2xl font-bold">Social Media</div>
            <Link href={"/"} className="flex gap-3 mb-4">
                <div><AiFillHome size={20} /></div>
                <div className="text-1xl">Home</div>
            </Link>
            <Link href={"/Search"} className="flex gap-3 mb-4">
                <div><CiSearch size={20} /></div>
                <div className="text-1xl">Search</div>
            </Link>
            <Link href={"/Reels"} className="flex gap-3 mb-4">
                <div><BsCameraReels size={20} /></div>
                <div className="text-1xl">Reels</div>
            </Link>
            <Link href={"/Messages"} className="flex gap-3 mb-4">
                <div><FiMessageSquare size={20} /></div>
                <div className="text-1xl">Messages</div>
            </Link>
            <Link href={"/Create"} className="flex gap-3 mb-4">
                <div><IoMdCreate size={20} /></div>
                <div className="text-1xl">Create</div>
            </Link>
            <Link href={"/Profile"} className="flex gap-3 mb-4">
                <div><CgProfile size={20} /></div>
                <div className="text-1xl">Profile</div>
            </Link>
        </div>
    )
}