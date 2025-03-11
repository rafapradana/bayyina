import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { addBookmark } from '@/lib/bookmarkService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface BookmarkButtonProps {
  surahId: number;
  surahName: string;
  ayahNumber?: number;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Nama bookmark harus minimal 2 karakter',
  }),
});

export const BookmarkButton = ({ surahId, surahName, ayahNumber }: BookmarkButtonProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: `Surah ${surahName}${ayahNumber ? ` Ayat ${ayahNumber}` : ''}`,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: 'Masuk diperlukan',
        description: 'Silakan masuk untuk menggunakan fitur bookmark',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const bookmark = {
        user_id: user.id,
        surah_id: surahId,
        ayah_number: ayahNumber,
        name: values.name,
      };

      const { error } = await addBookmark(bookmark);

      if (error) throw error;

      toast({
        title: 'Bookmark berhasil ditambahkan',
        description: `${values.name} telah ditambahkan ke bookmark Anda`,
      });

      setOpen(false);
    } catch (error) {
      console.error('Error adding bookmark:', error);
      toast({
        title: 'Gagal menambahkan bookmark',
        description: 'Terjadi kesalahan saat menyimpan bookmark',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Tidak menampilkan tombol jika pengguna belum login
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
          <Bookmark className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Bookmark</DialogTitle>
          <DialogDescription>
            Tambahkan ke bookmark untuk memudahkan Anda menemukan kembali.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Bookmark</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama bookmark" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 