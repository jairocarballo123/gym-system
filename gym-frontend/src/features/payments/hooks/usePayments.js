import { useState, useEffect, useCallback } from 'react';
import { paymentApi } from '../../../Api/PaymentApi';

export const usePayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadPayments = useCallback(async () => {
        setLoading(true);
        try {
            const data = await paymentApi.getAll();
            setPayments(data);
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
    }, []);

    useEffect(() => { loadPayments(); }, [loadPayments]);

    const createPayment = async (data) => {
        await paymentApi.create(data);
        await loadPayments();
    };

    const deletePayment = async (id) => {
        await paymentApi.delete(id);
        setPayments(prev => prev.filter(p => p.id !== id));
    };

    return { payments, loading, createPayment, deletePayment };
};