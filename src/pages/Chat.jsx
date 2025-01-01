import { Button, TextField, Box, Typography, IconButton } from '@mui/material';
import { signOut } from 'firebase/auth';
import { db } from '../core/db/firebase';
import Messages from './Messages';
import React, { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Send } from '@mui/icons-material';

const Chat = ({ SignOut, user }) => {
    const [pesan, setPesan] = useState('');
    const [messages, setMessage] = useState([]);

    useEffect(() => {
        if (!db) return;
        const q = query(collection(db, 'msg'), orderBy('createAt'));
        const unsubscribe = onSnapshot(q, (querySnapShot) => {
            const data = querySnapShot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setMessage(data);
        });
        return unsubscribe;
    }, [db]);

    const KirimPesan = async (e) => {
        e.preventDefault();

        if (pesan.trim() === "") return;

        try {
            await addDoc(collection(db, 'msg'), {
                Text: pesan,
                createAt: new Date(),
                uid: user.uid,
                displayName: user.displayName,
                photoUrl: user.photoURL,
            });
            setPesan(''); // Kosongkan input pesan setelah dikirim
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100vh", // pastikan chat mengisi seluruh tinggi layar
            maxWidth: "800px",
            margin: "0 auto",
            gap: "1rem",
            padding: "1rem",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}>
            <Typography variant="h4" textAlign="center">
                Welcome to The FireChat, {user.displayName}
            </Typography>
            <Button
                onClick={SignOut}
                variant="contained"
                color="error"
                sx={{
                    alignSelf: "center",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    maxWidth: "200px",
                }}
            >
                Sign Out
            </Button>

            <Box sx={{
                flexGrow: 1, // memungkinkan kotak pesan mengisi sisa ruang
                overflowY: "auto", // agar pesan bisa scroll jika banyak
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                padding: "1rem",
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
            }}>
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <Messages
                            key={msg.id}
                            messageId={msg.id}
                            createAt={msg.createAt}
                            text={msg.Text}
                            displayName={msg.displayName}
                            photoUrl={msg.photoUrl}
                            userId={user.uid}
                            msgUserId={msg.uid}
                        />
                    ))
                ) : (
                    <Typography variant="body1" sx={{ textAlign: "center", opacity: 0.6 }}>
                        No messages yet. Be the first to send one!
                    </Typography>
                )}
            </Box>

            <Box sx={{
                padding: "1rem",
                backgroundColor: "#fff",
                boxShadow: "0 -2px 4px rgba(0,0,0,0.1)",
            }}>
                <form onSubmit={KirimPesan} style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "1rem",
                    alignItems: "center", // Menjaga posisi input dan tombol kirim
                }}>
                    <TextField
                        label="Type your message..."
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setPesan(e.target.value)}
                        value={pesan}
                    />
                    <IconButton type="submit" variant="contained" color="primary">
                        <Send />
                    </IconButton>
                </form>
            </Box>
        </Box>
    );
};

export default Chat;
