"use client";
import { useFormik } from "formik";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const interviewSchema = z.object({
    interview_name: z.string().min(1, "Interview name is required"),
    role: z.string().min(1, "Role is required"),
    status: z.enum(["pending", "completed", "in-progress"]),
    scheduled_time: z.string().min(1, "Scheduled time is required"),
    duration_minutes: z
        .number({ invalid_type_error: "Duration must be a number" })
        .min(1, "Duration must be at least 1 minute"),
    subject: z
        .array(
            z.object({
                name: z.string().min(2, "Subject name is required"),
                description: z.string().min(5, "Description must be at least 5 characters"),
                proficiency: z.string().min(1, "Proficiency level is required"),
            })
        )
        .min(1, "At least one subject is required"),
});


const InterviewForm = () => {
    const [subject, setSubject] = useState([{ name: "", description: "", proficiency: "" }]);

    const formik = useFormik({
        initialValues: {
            interview_name: "",
            role: "",
            status: "pending",
            scheduled_time: "",
            duration_minutes: 60,
            subject,
        },
        validate: (values) => {
            return interviewSchema.safeParse(values).error?.formErrors.fieldErrors || {};
        },
        onSubmit: async (values) => {
            try {
                const response = await fetch("/api/interview", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });
                if (!response.ok) throw new Error("Failed to submit");
                alert("Interview created successfully");
            } catch (error) {
                console.error(error);
                alert("Error submitting interview");
            }
        },
    });

    const addSubject = () => {
        setSubject([...subject, { name: "", description: "", proficiency: "" }]);
        formik.setFieldValue("subject", [...formik.values.subject, { name: "", description: "", proficiency: "" }]);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
        <div>
          <span>Interview Name</span>
          <Input {...formik.getFieldProps("interview_name")} />
          {formik.touched.interview_name && formik.errors.interview_name && (
            <p className="text-red-500 text-sm">{formik.errors.interview_name}</p>
          )}
        </div>
  
        <div>
          <span>Role</span>
          <Input {...formik.getFieldProps("role")} />
          {formik.touched.role && formik.errors.role && (
            <p className="text-red-500 text-sm">{formik.errors.role}</p>
          )}
        </div>
  
        <div>
          <span>Scheduled Time</span>
          <Input type="datetime-local" {...formik.getFieldProps("scheduled_time")} />
          {formik.touched.scheduled_time && formik.errors.scheduled_time && (
            <p className="text-red-500 text-sm">{formik.errors.scheduled_time}</p>
          )}
        </div>
  
        <div>
          <span>Duration (minutes)</span>
          <Input type="number" {...formik.getFieldProps("duration_minutes")} />
          {formik.touched.duration_minutes && formik.errors.duration_minutes && (
            <p className="text-red-500 text-sm">{formik.errors.duration_minutes}</p>
          )}
        </div>
  
        <div>
          <span>Subjects</span>
          {subject.map((sub, index) => (
            <div key={index} className="space-y-2 border p-2 rounded-md">
              <Input
                placeholder="Subject Name"
                {...formik.getFieldProps(`subjects.${index}.name`)}
              />
              {/* {formik.touched.subject?.[index]?.name && formik.errors.subject?.[index]?.name && (
                <p className="text-red-500 text-sm">{formik.errors.subject[index]?.name}</p>
              )} */}
              
              <Input
                placeholder="Description"
                {...formik.getFieldProps(`subjects.${index}.description`)}
              />
              {/* {formik.touched.subject?.[index]?.description && formik.errors.subject?.[index]?.description && (
                <p className="text-red-500 text-sm">{formik.errors.subject[index]?.description}</p>
              )} */}
  
              <Input
                placeholder="Proficiency"
                {...formik.getFieldProps(`subjects.${index}.proficiency`)}
              />
              {/* {formik.touched.subject?.[index]?.proficiency && formik.errors.subject?.[index]?.proficiency && (
                <p className="text-red-500 text-sm">{formik.errors.subject[index]?.proficiency}</p>
              )} */}
            </div>
          ))}
          <Button type="button" onClick={addSubject} className="mt-2">Add Subject</Button>
        </div>
  
        <Button type="submit">Submit</Button>
      </form>
    );
};

export default InterviewForm;
