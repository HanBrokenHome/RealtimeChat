import { Box, Typography, Avatar, IconButton, Button } from '@mui/material';
import { deleteDoc, doc } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from 'react';
import { db } from '../core/db/firebase'; // pastikan db sudah diimport

const Messages = ({ createAt = null, text = "", displayName = "", photoUrl = "", userId, msgUserId, messageId }) => {
    const isCurrentUser = userId === msgUserId;
    const [Loading, setLoading]= useState(false)
    const formattedTime = createAt?.seconds
        ? (() => {
            const date = new Date(createAt.seconds * 1000);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        })()
        : null;

    const handleDelete = async () => {
        setLoading(false)
        try {
            setTimeout(async() => {
                const messageRef = doc(db, 'msg', messageId); // 'msg' adalah nama koleksi Firestore
                await deleteDoc(messageRef);
            }, 1000);
            // Hapus chat dari Firestore menggunakan messageId
        } catch (error) {
            console.error("Error menghapus pesan: ", error);
        }
        finally{
            setLoading(true)
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: isCurrentUser ? "row-reverse" : "row",
                alignItems: "center",
                gap: "0.5rem",
            }}
        >
            {photoUrl && (
                <Avatar
                    alt={displayName}
                    src={photoUrl}
                    sx={{ width: 40, height: 40 }}
                />
            )}
            <Box
                sx={{
                    height: "100%",
                    backgroundColor: isCurrentUser ? "#007bff" : "#e9ecef",
                    color: isCurrentUser ? "#fff" : "#000",
                    borderRadius: "10px",
                    padding: "0.75rem",
                    maxWidth: "70%",
                    wordWrap: "break-word",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
            >
                {displayName && (
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {displayName}
                    </Typography>
                )}
                <Typography variant="body1">{text}</Typography>
                {createAt?.seconds && formattedTime && (
                    <Typography
                        variant="caption"
                        sx={{ display: "block", marginTop: "0.25rem", fontSize: "0.75rem", opacity: 0.7 }}
                    >
                        {formattedTime}
                    </Typography>
                )}
            </Box>

            {isCurrentUser && (
                <Button onClick={handleDelete} sx={{ color: "red" }} disabled={Loading}>
                    <DeleteIcon/>
                </Button>
            )}
        </Box>
    );
};

export default Messages;
