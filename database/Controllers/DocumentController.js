import mongoose from "mongoose";
import Users from "../Models/UserSchema";
import Document from "../Models/DocumentSchema";


export const UploadDoc = async (req, res) => {
    try {
        const formData = req.body;

        if (formData) {
            await Document.create(formData, async (err, data) => {
                if (err) throw err;
                if (data) {
                    const docIds = [...formData?.prevDocIds, data?._id];
                    await Users.updateOne(
                        { _id: formData?.User },
                        {
                            $set: {
                                Documents: docIds?.map(x => mongoose.Types.ObjectId(x))
                            },
                        }
                    )
                    res.status(200).json({ success: true, data });
                }
            })

        } else {
            res.status(404).json({ success: false, error: "Error occured please try again!" })
        }
    } catch (error) {
        res.status(404).json({ success: false, error })
    }
}

export const DeleteDoc = async (req, res) => {
    try {
        const { id } = req.query;
        if (id) {
            const response = await Document.findByIdAndDelete(id);
            return res.status(200).json({ success: true, response });
        } else {
            res.status(404).json({ success: false, error: "Error occured please try again!" })
        }
    } catch (error) {
        res.status(404).json({ success: false, error })
    }
}

export const EditDoc = async (req, res) => {
    try {
        const { id, FileName } = req.query;
        if (id) {
            const response = await Document.updateOne(
                { _id: id },
                {
                    $set: {
                        FileName
                    },
                }
            );
            return res.status(200).json({ success: true, response });
        } else {
            res.status(404).json({ success: false, error: "Error occured please try again!" })
        }
    } catch (error) {
        res.status(404).json({ success: false, error })
    }
}