import React, { useState } from 'react';
import type { Member } from '../types';
import { FormInput } from './forms/FormElements';

interface ProfileAppProps {
    currentUser: Member;
    onSaveProfile: (updatedData: Partial<Member>) => void;
    onChangePassword: (currentPassword: string, newPassword: string) => { success: boolean, message: string };
}

export const ProfileApp: React.FC<ProfileAppProps> = ({ currentUser, onSaveProfile, onChangePassword }) => {
    const [name, setName] = useState(currentUser.name);
    const [role, setRole] = useState(currentUser.role);
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProfileMessage(null);
        try {
            onSaveProfile({ name, role });
            setProfileMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        } catch (error) {
            setProfileMessage({ type: 'error', text: 'Ocorreu um erro ao atualizar o perfil.' });
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'As novas senhas não coincidem.' });
            return;
        }
        if (newPassword.length < 6) {
             setPasswordMessage({ type: 'error', text: 'A nova senha deve ter no mínimo 6 caracteres.' });
            return;
        }

        const result = onChangePassword(currentPassword, newPassword);
        setPasswordMessage({ type: result.success ? 'success' : 'error', text: result.message });
        if (result.success) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8 text-white">
            <div className="flex items-center space-x-6">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-24 h-24 rounded-full border-4 border-slate-600" />
                <div>
                    <h2 className="text-3xl font-bold">{currentUser.name}</h2>
                    <p className="text-sky-400">{currentUser.role}</p>
                    <p className="text-sm text-slate-400">{currentUser.email}</p>
                </div>
            </div>

            <section className="bg-slate-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-lime-400 mb-4">Atualizar Informações</h3>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <FormInput label="Nome" name="name" value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} required />
                    <FormInput label="Função / Cargo" name="role" value={role} onChange={(e) => setRole((e.target as HTMLInputElement).value)} required />
                    {profileMessage && (
                        <p className={`text-sm p-3 rounded-md ${profileMessage.type === 'success' ? 'bg-lime-900/50 text-lime-300' : 'bg-red-900/50 text-red-300'}`}>
                            {profileMessage.text}
                        </p>
                    )}
                    <button type="submit" className="w-full sm:w-auto py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">
                        Salvar Informações
                    </button>
                </form>
            </section>
            
            <section className="bg-slate-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-lime-400 mb-4">Alterar Senha</h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <FormInput label="Senha Atual" name="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword((e.target as HTMLInputElement).value)} required />
                    <FormInput label="Nova Senha" name="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword((e.target as HTMLInputElement).value)} required />
                    <FormInput label="Confirmar Nova Senha" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword((e.target as HTMLInputElement).value)} required />
                    {passwordMessage && (
                         <p className={`text-sm p-3 rounded-md ${passwordMessage.type === 'success' ? 'bg-lime-900/50 text-lime-300' : 'bg-red-900/50 text-red-300'}`}>
                            {passwordMessage.text}
                        </p>
                    )}
                    <button type="submit" className="w-full sm:w-auto py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">
                        Alterar Senha
                    </button>
                </form>
            </section>
        </div>
    );
};
