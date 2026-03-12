import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useChatStore } from './store';
import { Send, Image, ShieldAlert } from 'lucide-react';

const socket = io('chatting-production-d995.up.railway.app');

function App() {
  const [text, setText] = useState('');
  const { messages, addMessage } = useChatStore();

  useEffect(() => {
    socket.on('receive_message', (msg) => addMessage({ ...msg, sender: 'other' }));
    return () => socket.off('receive_message');
  }, [addMessage]);

  const send = (type, content) => {
    const msg = { type, content, sender: 'me', time: new Date().toLocaleTimeString() };
    socket.emit('send_message', msg);
    addMessage(msg);
    setText('');
  };

  const handleImg = (e) => {
    const reader = new FileReader();
    reader.onload = () => send('image', reader.result);
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="h-screen flex flex-col bg-[#e5ddd5] max-w-md mx-auto shadow-xl">
      <div className="bg-[#075e54] p-4 text-white font-bold flex justify-between">
        <span>Jaguar Messenger</span>
        <ShieldAlert className="cursor-pointer" onClick={() => window.location.href='/admin'}/>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 rounded-lg max-w-[70%] ${m.sender === 'me' ? 'bg-[#dcf8c6]' : 'bg-white'}`}>
              {m.type === 'text' ? <p>{m.content}</p> : <img src={m.content} className="rounded" />}
              <span className="text-[10px] text-gray-500 float-right">{m.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-gray-200 flex items-center gap-2">
        <label className="cursor-pointer"><Image /><input type="file" hidden onChange={handleImg}/></label>
        <input className="flex-1 p-2 rounded-full border-none" value={text} onChange={e=>setText(e.target.value)} placeholder="Ketik pesan..."/>
        <button onClick={() => send('text', text)} className="bg-[#075e54] p-2 rounded-full text-white"><Send size={20}/></button>
      </div>
    </div>
  );
}
export default App;
