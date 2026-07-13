import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Edit2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/offers")({
  component: AdminOffers,
});

const NO_PRODUCT = "__none__";

function AdminOffers() {
  const queryClient = useQueryClient();

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["adminOffers"],
    queryFn: api.getAdminOffers,
  });

  // نحتاج قائمة المنتجات لربط العرض بمنتج (لكي يعمل زر "افتح المنتج" في صفحة العروض)
  const { data: products = [] } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: api.getAdminProducts,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [deletingOffer, setDeletingOffer] = useState<any>(null);

  // Form State — أضفنا: product_id, old_price, new_price, expires_in, savings
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    discount_type: "fixed",
    discount_value: "",
    is_active: true,
    product_id: "",
    old_price: "",
    new_price: "",
    expires_in: "",
    savings: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      discount_type: "fixed",
      discount_value: "",
      is_active: true,
      product_id: "",
      old_price: "",
      new_price: "",
      expires_in: "",
      savings: "",
    });
    setEditingOffer(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (offer: any) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title || "",
      description: offer.description || "",
      image_url: offer.image_url || "",
      discount_type: offer.discount_type || "fixed",
      discount_value: offer.discount_value?.toString() || "",
      is_active: offer.is_active ?? true,
      product_id: offer.product_id || "",
      old_price: offer.old_price?.toString() || "",
      new_price: offer.new_price?.toString() || "",
      expires_in: offer.expires_in || "",
      savings: offer.savings || "",
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (offer: any) => {
    setDeletingOffer(offer);
    setIsDeleteOpen(true);
  };

  // Mutations
  const createMut = useMutation({
    mutationFn: api.createOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOffers"] });
      toast.success("تمت إضافة العرض بنجاح");
      setIsFormOpen(false);
    },
    onError: (err: any) => toast.error(err.message || "حدث خطأ"),
  });

  const updateMut = useMutation({
    mutationFn: (data: any) => api.updateOffer(editingOffer.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOffers"] });
      toast.success("تم تحديث العرض بنجاح");
      setIsFormOpen(false);
    },
    onError: (err: any) => toast.error(err.message || "حدث خطأ"),
  });

  const deleteMut = useMutation({
    mutationFn: api.deleteOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOffers"] });
      toast.success("تم حذف العرض بنجاح");
      setIsDeleteOpen(false);
    },
    onError: (err: any) => toast.error(err.message || "حدث خطأ"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("اسم العرض مطلوب");
      return;
    }
    if (!formData.new_price) {
      toast.error("السعر الجديد مطلوب");
      return;
    }

    const submitData = {
      title: formData.title,
      description: formData.description || null,
      image_url: formData.image_url || null,
      discount_type: formData.discount_type as "percentage" | "fixed",
      discount_value: formData.discount_value ? parseFloat(formData.discount_value) : null,
      is_active: formData.is_active,
      product_id: formData.product_id ? formData.product_id : null,
      old_price: formData.old_price ? parseFloat(formData.old_price) : null,
      new_price: formData.new_price ? parseFloat(formData.new_price) : null,
      expires_in: formData.expires_in || null,
      savings: formData.savings || null,
    };

    if (editingOffer) {
      updateMut.mutate(submitData);
    } else {
      createMut.mutate(submitData);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 lg:p-8 shadow-sm ring-1 ring-black/5 min-h-[400px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl lg:text-2xl font-semibold text-ink">إدارة العروض</h2>
        <Button onClick={handleOpenCreate} className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          إضافة عرض
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">جاري التحميل...</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right whitespace-nowrap">الصورة</TableHead>
                <TableHead className="text-right whitespace-nowrap">اسم العرض</TableHead>
                <TableHead className="text-right whitespace-nowrap">السعر</TableHead>
                <TableHead className="text-right whitespace-nowrap">الخصم</TableHead>
                <TableHead className="text-right whitespace-nowrap">المنتج</TableHead>
                <TableHead className="text-right whitespace-nowrap">الحالة</TableHead>
                <TableHead className="text-right whitespace-nowrap">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((offer: any) => {
                const linkedProduct = products.find((p: any) => p.id === offer.product_id);
                return (
                  <TableRow key={offer.id}>
                    <TableCell>
                      {offer.image_url ? (
                        <img
                          src={offer.image_url}
                          alt={offer.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs">
                          بدون صورة
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{offer.title}</TableCell>
                    <TableCell>
                      {offer.new_price != null ? (
                        <div className="flex flex-col">
                          <span className="font-semibold">{offer.new_price} ج.م</span>
                          {offer.old_price != null && (
                            <span className="text-xs text-gray-400 line-through">
                              {offer.old_price} ج.م
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {offer.discount_value != null
                        ? `${offer.discount_value} ${offer.discount_type === "percentage" ? "%" : "ج.م"}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {linkedProduct ? linkedProduct.name : <span className="text-gray-400">غير مرتبط</span>}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${offer.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {offer.is_active ? "نشط" : "غير نشط"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleOpenEdit(offer)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleOpenDelete(offer)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {offers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-4">
                    لا توجد عروض بعد.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingOffer ? "تعديل العرض" : "إضافة عرض جديد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">اسم العرض *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="مثال: عرض التوفير"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">رابط الصورة (Image URL)</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                dir="ltr"
                className="text-left"
              />
            </div>

            {/* ربط بمنتج — ليعمل زر الدخول من صفحة العروض */}
            <div className="space-y-2">
              <Label>المنتج المرتبط</Label>
              <Select
                value={formData.product_id || NO_PRODUCT}
                onValueChange={(v) =>
                  setFormData({ ...formData, product_id: v === NO_PRODUCT ? "" : v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر منتجاً (اختياري)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_PRODUCT}>بدون ربط</SelectItem>
                  {products.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-gray-500">
                إذا لم تختر منتجاً فلن يفتح المستخدم صفحة المنتج من العرض.
              </p>
            </div>

            {/* الأسعار */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="old_price">السعر قبل الخصم</Label>
                <Input
                  id="old_price"
                  type="number"
                  step="0.01"
                  value={formData.old_price}
                  onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                  placeholder="اختياري"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_price">السعر بعد الخصم *</Label>
                <Input
                  id="new_price"
                  type="number"
                  step="0.01"
                  value={formData.new_price}
                  onChange={(e) => setFormData({ ...formData, new_price: e.target.value })}
                  placeholder="السعر النهائي المعروض"
                />
              </div>
            </div>

            {/* الخصم */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نوع الخصم</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(v) => setFormData({ ...formData, discount_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                    <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount_value">قيمة الخصم</Label>
                <Input
                  id="discount_value"
                  type="number"
                  step="0.01"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                />
              </div>
            </div>

            {/* حقول إضافية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expires_in">مدة الانتهاء</Label>
                <Input
                  id="expires_in"
                  value={formData.expires_in}
                  onChange={(e) => setFormData({ ...formData, expires_in: e.target.value })}
                  placeholder="مثال: ينتهي خلال 3 أيام"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="savings">نص التوفير</Label>
                <Input
                  id="savings"
                  value={formData.savings}
                  onChange={(e) => setFormData({ ...formData, savings: e.target.value })}
                  placeholder="مثال: وفّر 20 ج.م"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <Label htmlFor="is_active" className="cursor-pointer">
                العرض نشط
              </Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>
                {createMut.isPending || updateMut.isPending ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف العرض "{deletingOffer?.title}" بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteMut.mutate(deletingOffer?.id)}
            >
              {deleteMut.isPending ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
