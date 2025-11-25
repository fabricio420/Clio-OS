
import React, { useState, useEffect } from 'react';
import type { Member } from '../../types';
import { FormInput } from './FormElements';

const fileToBase64 = (file: File): Promise<string> => 
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

export const MemberForm: React.FC<{ onSubmit: (data: Member) => void, member: Member | null }> = ({ onSubmit, member }) => {
    const [formData, setFormData] = useState({ name: '', vulgo: '', role: '' });
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(member?.avatar || null);
    const [error, setError] = useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (member) {
            setFormData({ name: member.name, vulgo: member.vulgo || '', role: member.role });
            setPreviewUrl(member.avatar);
        }
    }, [member]);

    useEffect(() => {
        const currentUrl = previewUrl;
        // Cleanup object URL if it's a blob and the component unmounts or the url changes
        return () => {
            if (currentUrl && currentUrl.startsWith('blob:')) {
                URL.revokeObjectURL(currentUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 2 * 1024 * 1024) { // 2MB limit
                setError('O arquivo é muito grande. O limite é 2MB.');
                return;
            }
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setError('');
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!member) return;
        setError('');
        try {
            let avatarDataUrl = member.avatar;
            if (file) {
                avatarDataUrl = await fileToBase64(file);
            }
            onSubmit({
                ...member,
                name: formData.name,
                vulgo: formData.vulgo || undefined,
                role: formData.role,
                avatar: avatarDataUrl,
            });
        } catch (err) {
            setError('Não foi possível carregar o arquivo de imagem.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center space-y-2">
                 <img
                    src={previewUrl || 'https://i.pravatar.cc/150?u=default'}
                    alt="Prévia do avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-600"
                />
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-4 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-md transition"
                >
                    Alterar Foto
                </button>
            </div>
            
            <FormInput label="Nome Completo" name="name" value={formData.name} onChange={handleFormChange} required />
            <FormInput label="Nome Artístico (Vulgo)" name="vulgo" value={formData.vulgo} onChange={handleFormChange} placeholder="Opcional" />
            <FormInput label="Função / Cargo" name="role" value={formData.role} onChange={handleFormChange} required />

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            
            <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
            >
                Salvar Alterações
            </button>
        </form>
    );
};