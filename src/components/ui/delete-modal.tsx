
'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface DeleteModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

const DeleteModal = ({ open, onClose, onConfirm, loading }: DeleteModalProps) => {
    const t = useTranslations('admin.reviews');
    const { locale } = useParams();
    const isRtl = locale === 'ar';

    return (
        <AlertDialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) onClose();
        }}>
            <AlertDialogContent dir={isRtl ? 'rtl' : 'ltr'}>
                <AlertDialogHeader className={isRtl ? 'text-right' : 'text-left'}>
                    <AlertDialogTitle>{t('deleteTitle') || 'Delete Review'}</AlertDialogTitle>
                    <AlertDialogDescription className={isRtl ? 'text-right' : 'text-left'}>
                        {t('deleteConfirm') || 'Are you sure you want to delete this review?'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>{t('cancel') || 'Cancel'}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={loading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {t('deleting') || 'Deleting...'}
                            </div>
                        ) : (
                            t('delete') || 'Delete'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteModal;
