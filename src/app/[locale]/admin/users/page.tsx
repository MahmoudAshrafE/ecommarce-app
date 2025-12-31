'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Users, Search, Trash2, Pencil, Mail, Calendar } from 'lucide-react'
import { Loader } from "@/components/ui/loader"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { toast } from '@/components/ui/use-toast'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface User {
    id: string
    name: string
    email: string
    role: string
    createdAt: string
}

const UsersPage = () => {
    const { locale } = useParams()
    const t = useTranslations()
    const isRtl = locale === 'ar'
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ name: '', email: '', role: 'USER' })
    const [submitting, setSubmitting] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users')
            if (response.ok) {
                const data = await response.json()
                setUsers(data)
            }
        } catch (error) {
            console.error('Failed to fetch users:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleDeleteUser = async () => {
        if (!deletingUserId) return

        try {
            const response = await fetch(`/api/admin/users/${deletingUserId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setUsers(users.filter(user => user.id !== deletingUserId))
                toast({
                    description: t('messages.deleteUserSucess')
                })
            }
        } catch (error) {
            console.error('Failed to delete user:', error)
        } finally {
            setIsDeleteDialogOpen(false)
            setDeletingUserId(null)
        }
    }

    const openDeleteDialog = (userId: string) => {
        setDeletingUserId(userId)
        setIsDeleteDialogOpen(true)
    }

    const openEditDialog = (user: User) => {
        setEditingUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role
        })
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingUser) return
        setSubmitting(true)

        try {
            const response = await fetch(`/api/admin/users/${editingUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                await fetchUsers()
                setIsDialogOpen(false)
                setEditingUser(null)
                toast({
                    description: t('messages.updateUserSucess')
                })
            }
        } catch (error) {
            console.error('Error updating user:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return <div className="flex justify-center p-8"><Loader size="lg" variant="burger" /></div>
    }

    return (
        <div className="bg-card rounded-xl sm:rounded-2xl border border-border shadow-sm p-4 sm:p-6">
            <div className="mb-6 sm:mb-8">
                <div className="relative max-w-md">
                    <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
                    <Input
                        type="text"
                        placeholder={t('admin.users.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${isRtl ? 'pr-9' : 'pl-9'} h-10`}
                    />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr className={isRtl ? 'flex-row-reverse' : ''}>
                            <th className={`${isRtl ? 'text-right' : 'text-left'} p-4 font-medium`}>{t('profile.form.name.label')}</th>
                            <th className={`${isRtl ? 'text-right' : 'text-left'} p-4 font-medium`}>{t('profile.form.email.label')}</th>
                            <th className={`${isRtl ? 'text-right' : 'text-left'} p-4 font-medium`}>{t('admin.users.role')}</th>
                            <th className={`${isRtl ? 'text-left' : 'text-right'} p-4 font-medium`}>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-t hover:bg-muted/50 transition-colors">
                                <td className={`p-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{user.name}</td>
                                <td className={`p-4 ${isRtl ? 'text-right' : 'text-left'}`}>{user.email}</td>
                                <td className={`p-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN'
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className={`p-4 flex ${isRtl ? 'justify-start' : 'justify-end'} gap-2`}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openEditDialog(user)}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => openDeleteDialog(user.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="bg-secondary/30 rounded-lg p-4 border border-border" dir={isRtl ? 'rtl' : 'ltr'}>
                        <div className={`flex flex-col gap-2 mb-3 bg-red-500/0 ${isRtl ? 'items-end' : 'items-start'}`}>
                            <div className="w-full">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-sm">{user.name}</h3>
                                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'ADMIN'
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                        {user.role}
                                    </span>
                                </div>
                                <p className={`text-xs text-muted-foreground flex items-center gap-1.5 w-full ${isRtl ? 'flex-row-reverse' : ''}`} style={{ wordBreak: 'break-all' }}>
                                    <Mail className="w-3 h-3 flex-shrink-0" />
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <div className={`flex gap-2 pt-3 border-t border-border ${isRtl ? 'flex-row-reverse justify-end' : 'justify-end'}`}>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openEditDialog(user)}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => openDeleteDialog(user.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md" dir={isRtl ? 'rtl' : 'ltr'}>
                    <DialogHeader className={isRtl ? 'text-right sm:text-right' : 'text-left'}>
                        <DialogTitle className={isRtl ? 'text-right' : ''}>{t('admin.users.editUser')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('profile.form.name.label')}</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('profile.form.email.label')}</label>
                            <Input
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                type="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('admin.users.role')}</label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => setFormData({ ...formData, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">USER</SelectItem>
                                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">{t('cancel')}</Button>
                            </DialogClose>
                            <Button type="submit" loading={submitting}>
                                {t('save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent dir={isRtl ? 'rtl' : 'ltr'}>
                    <AlertDialogHeader className={isRtl ? 'text-right' : 'text-left'}>
                        <AlertDialogTitle>{t('messages.userDeleteConfirm')}</AlertDialogTitle>
                        <AlertDialogDescription className={isRtl ? 'text-right' : 'text-left'}>
                            {t('messages.userDeleteDescription')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {t('delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default UsersPage
