
import React, { useState, useEffect } from 'react';
import type { Member } from '../../types';
import { FormInput } from './FormElements';
import { supabase } from '../../supabaseClient';

export const MemberForm: React.FC<{ onSubmit: (data: Member) => void, member: Member | null }> = ({ onSubmit, member }) => {
    const [formData, setFormData] = useState({ name: '', role: '' });
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(member?.avatar || null);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (member) {
            setFormData({ name: member.name, role: member.role });
            setPreviewUrl(member.avatar);
        }
    }, [member]);

    useEffect(() => {
        const currentUrl = previewUrl;
        // Cleanup object URL if it's a blob
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

    const uploadAvatar = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `avatars/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
            .from('clio-public')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('clio-public')
            .getPublicUrl(fileName);

        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!member) return;
        setError('');
        setIsUploading(true);

        try {
            let avatarDataUrl = member.avatar;
            if (file) {
                avatarDataUrl = await uploadAvatar(file);
            }
            onSubmit({
                ...member,
                ...formData,
                avatar: avatarDataUrl,
            });
        } catch (err) {
            console.error(err);
            setError('Erro ao fazer upload da imagem.');
        } finally {
            setIsUploading(false);
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
            
            <FormInput label="Nome" name="name" value={formData.name} onChange={handleFormChange} required />
            <FormInput label="Função / Cargo" name="role" value={formData.role} onChange={handleFormChange} required />

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            
            <button
                type="submit"
                disabled={isUploading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition disabled:bg-slate-600"
            >
                {isUploading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
        </form>
    );
};
