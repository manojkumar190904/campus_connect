import { NextResponse } from "next/server";
import { requireAction } from "@/lib/auth-guard";
import { audit, createRecord, notify } from "@/lib/workflows";

async function uploadToCloudinary(file: File) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim();
  if (!cloudName || !uploadPreset) return null;

  try {
    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", uploadPreset);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, { method: "POST", body });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return null;
    return typeof payload.secure_url === "string" ? payload.secure_url : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const auth = await requireAction("notes:upload");
  if ("error" in auth) return auth.error;

  try {
    const form = await request.formData();
    const title = String(form.get("title") || "").trim();
    const department = String(form.get("department") || auth.user.department || "MCA").trim();
    const semester = String(form.get("semester") || "").trim();
    const section = String(form.get("section") || "A").trim();
    const subject = String(form.get("subject") || "").trim();
    const unit = String(form.get("unit") || "").trim();
    const description = String(form.get("description") || "").trim();
    const file = form.get("file");

    if (!title || !department || !semester || !section || !subject) {
      return NextResponse.json({ message: "Title, department, semester, section and subject are required" }, { status: 400 });
    }

    const uploadedFile = file instanceof File ? file : null;
    const cloudinaryUrl = uploadedFile ? await uploadToCloudinary(uploadedFile) : null;
    const note = await createRecord("notes", {
      title,
      department,
      semester,
      section,
      subject,
      unit,
      description,
      fileUrl: cloudinaryUrl || (uploadedFile ? `/mock/${encodeURIComponent(uploadedFile.name)}` : "/mock/local-note.txt"),
      fileName: uploadedFile?.name || "local-note.txt",
      fileSize: uploadedFile?.size || 0,
      uploadedBy: auth.user.campusId,
      status: "Pending",
      approvalStatus: "pending_approval"
    });

    await notify({ role: "hod", title: "New note pending approval", message: "New note pending approval", type: "notes" });
    await audit({ actorCampusId: auth.user.campusId, action: "Note uploaded", target: note.id, details: note.title, role: auth.user.role });
    return NextResponse.json({ note, message: "Note uploaded successfully and sent to HOD for approval." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to upload note" }, { status: 400 });
  }
}
