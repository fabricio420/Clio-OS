import React, { useState, useEffect } from 'react';
import type { MeetingMinute } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { FormInput, FormCheckbox } from './FormElements';

interface MeetingMinuteFormProps {
    onSubmit: (data: Omit<MeetingMinute, 'id'>, id?: string) => void;
    minute: MeetingMinute | null;
}

export const MeetingMinuteForm: React.FC<MeetingMinuteFormProps> = ({ onSubmit, minute }) => {
    const { members } = useAppContext();
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        attendeeIds: [] as string[],
        agenda: '',
        decisions: ''
    });

    useEffect(() => {
        if (minute) {
            setFormData({
                date: minute.date.split('T')[0],
                attendeeIds: minute.attendeeIds,
                agenda: minute.agenda,
                decisions: minute.decisions
            });
        }
    }, [minute]);

    const handleAttendeeChange = (memberId: string) => {
        setFormData(prev => {
            const newAttendeeIds = prev.attendeeIds.includes(memberId)
                ? prev.attendeeIds.filter(id => id !== memberId)
                : [...prev.attendeeIds, memberId];
            return { ...prev, attendeeIds: newAttendeeIds };
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, minute?.id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
                label="Data da Reunião"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
            />
            
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Participantes Presentes</label>
                <div className="max-h-32 overflow-y-auto space-y-2 p-2 bg-slate-700 rounded-md border border-slate-600">
                    {members.map(member => (
                        <FormCheckbox
                            key={member.id}
                            label={member.name}
                            checked={formData.attendeeIds.includes(member.id)}
                            onChange={() => handleAttendeeChange(member.id)}
                        />
                    ))}
                </div>
            </div>

            <FormInput
                label="Pautas Discutidas"
                name="agenda"
                as="textarea"
                rows={4}
                value={formData.agenda}
                onChange={handleChange}
                placeholder="1. Assunto A&#10;2. Assunto B"
                required
            />

            <FormInput
                label="Decisões Tomadas"
                name="decisions"
                as="textarea"
                rows={4}
                value={formData.decisions}
                onChange={handleChange}
                placeholder="Ficou decidido que..."
                required
            />

            <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">
                Salvar Ata
            </button>
        </form>
    );
};