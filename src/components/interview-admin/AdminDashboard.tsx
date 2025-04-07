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
import InterviewList from './InterviewList';
import InterviewForm from './InterviewForm';


const AdminDashboard = () => {
    const [showCreateInterviewForm, setShowCreateInterviewForm] = useState(false)

    return (
        <div>
            {/* Navbar */}
            <div className='flex  flex-row justify-between items-center shadow-md px-4 py-2'>
                <div className='flex flex-row gap-x-3'><span className='text-2xl font-semibold'>Interviewer Dashboard</span><Button onClick={() => setShowCreateInterviewForm(true)}>Create Interview<Plus /> </Button></div>
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
            <InterviewList />
            {showCreateInterviewForm && <Modal modalOpen={showCreateInterviewForm} setModalOpen={setShowCreateInterviewForm} modalHeading="Create Interview">
                <InterviewForm />
            </Modal>}



        </div>
    )
}

export default AdminDashboard