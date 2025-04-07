import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Modal from '@/input-components/CustomModal';

const CandidateList = () => {
  return (
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
  )
}

export default CandidateList