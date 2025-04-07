"use client";
import React, { useState } from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import Modal from '@/input-components/CustomModal';


const AdminDashboard = () => {
    const [showCandidateModal, setShowCandidateModal] = useState(false)

    return (
        <div>
            {/* Navbar */}
            <div className='flex  flex-row justify-between items-center shadow-md px-4 py-2'>
                <div className='flex flex-row gap-x-3'><span className='text-2xl font-semibold'>Interviewer Dashboard</span><Button>Create Interview<Plus /> </Button></div>
                <div className='flex items-center gap-4 flex-row'>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-y-0'>
                        <span className='leading-tight'>asish.nayak@eximietas.design</span>
                        <span className='underline font-semibold cursor-pointer'>Logout</span>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="h-[80vh] 2xl:h-[90vh] w-full overflow-y-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div key={index} className="relative group">
                            <Card className="relative w-full h-[40vh] 2xl:h-[25vh] flex items-center transition-all duration-300 overflow-hidden">
                                {/* Main Content (Doesn't change on hover) */}
                                <CardContent className="flex flex-col justify-start h-full text-normal font-semibold transition-all duration-300 w-full pr-4 gap-y-3">
                                    <span>Interview name : Software Developer</span>
                                    <span>Role : Junior</span>
                                    <span>Scheduled on : 2025-04-03T08:26:57</span>
                                    <span>Duration : 57 Minutes</span>
                                    <div>
                                        Subjects :
                                        {["Python", "SQL", "React", "Docker", "Node.js", "GraphQL"] // Example subjects
                                            .slice(0, 5) // Show only the first 5 subjects
                                            .map((subject, idx) => (
                                                <span key={idx} className="rounded-full border px-2 text-sm py-1 ml-1">{subject}</span>
                                            ))}

                                        {/* Show ellipsis if more than 5 subjects */}
                                        {["Python", "SQL", "React", "Docker", "Node.js", "GraphQL"].length > 5 && (
                                            <span className="ml-1">...</span>
                                        )}
                                    </div>
                                </CardContent>

                                {/* Right Side Panel (Slides in without affecting content) */}
                                <div className="absolute top-0 right-0 h-full rounded-2xl border w-0 group-hover:w-[25%] transition-all duration-500 overflow-hidden">
                                    <div className="h-full flex flex-col justify-around items-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <Button variant="outline" size="sm">Details</Button>
                                        <Button variant="outline" size="sm">Update</Button>
                                        <Button variant="outline" size="sm">Delete</Button>
                                        <Button onClick={()=>setShowCandidateModal(true)} variant="outline" size="sm">Candidates</Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
            {showCandidateModal && <Modal modalOpen={showCandidateModal} setModalOpen={setShowCandidateModal} modalHeading="Candidates List">
            <div className="max-h-[80vh] 2xl:max-h-[70vh] w-full overflow-y-auto px-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 2xl:grid-cols-4 gap-5">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div key={index} className="relative group">
                            <Card className="relative w-full h-[25vh] 2xl:h-[15vh] flex items-center transition-all duration-300 overflow-hidden">
                                {/* Main Content (Doesn't change on hover) */}
                                <CardContent className="flex flex-col justify-start h-full text-normal font-semibold transition-all duration-300 w-full pr-4 gap-y-3">
                                    <span>Asish Kumar Nayak</span>
                                    <span>Experience : 4yr</span>
                                </CardContent>

                                {/* Right Side Panel (Slides in without affecting content) */}
                                <div className="absolute bottom-0 left-0 w-full h-0 rounded-2xl border group-hover:h-[40%] transition-all duration-500 overflow-hidden ">
                                    <div className="h-full flex flex-row justify-around items-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <Button variant="outline" size="sm">Invite Again</Button>
                                        <Button variant="outline" size="sm">Show Summary</Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
                </Modal>}


        </div>
    )
}

export default AdminDashboard