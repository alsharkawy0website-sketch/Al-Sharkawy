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
import { Edit2, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: api.getAdminProducts,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: api.getCategories,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<any>(null);
  const [deletingProd, setDeletingProd] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    image_url: "",
    base_price: "",
    discount_type: "none",
    discount_value: "",
    is_active: true,
  });

  const [sizes, setSizes] = useState<any[]>([]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category_id: "",
      image_url: "",
      base_price: "",
      discount_type: "none",
      discount_value: "",
      is_active: true,
    });
    setSizes([]);
    setEditingProd(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prod: any) => {
    setEditingProd(prod);
    setFormData({
      name: prod.name || "",
      description: prod.description || "",
      category_id: prod.category_id || "",
      image_url: prod.image_url || "",
      base_price: prod.base_price?.toString() || "",
      discount_type: prod.discount_type || "none",
      discount_value: prod.discount_value?.toString() || "",
      is_active: prod.is_active ?? true,
    });
    setSizes(prod.product_sizes || []);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (prod: any) => {
    setDeletingProd(prod);
    setIsDeleteOpen(true);
  };

  // Size handlers
  const addSize = () => {
    setSizes([...sizes, { name: "", price: "", is_active: true }]);
  };

  const updateSize = (index: number, field: string, value: any) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setSizes(newSizes);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  // Mutations
  const createMut = useMutation({
    mutationFn: (data: { prod: any; sizes: any[] }) => api.createProduct(data.prod, data.sizes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      toast.success("تمت إضافة المنتج بنجاح");
      setIsFormOpen(false);
    },
    onError: (err: any) => toast.error(err.message || "حدث خطأ"),
  });

  const updateMut = useMutation({
    mutationFn: (data: { prod: any; sizes: any[] }) =>
      api.updateProduct(editingProd.id, data.prod, data.sizes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      toast.success("تم تحديث المنتج بنجاح");
      setIsFormOpen(false);
    },
    onError: (err: any) => toast.error(err.message || "حدث خطأ"),
  });

  const deleteMut = useMutation({
    mutationFn: api.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      toast.success("تم حذف المنتج بنجاح");
      setIsDeleteOpen(false);
    },
    onError: (err: any) => toast.error(err.message || "حدث خطأ"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category_id) {
      toast.error("الاسم والفئة مطلوبان");
      return;
    }

    if (sizes.length === 0 && !formData.base_price) {
      toast.error("يجب إدخال السعر الأساسي أو إضافة أحجام وأسعار");
      return;
    }

    if (sizes.length > 0) {
      const invalidSize = sizes.find((s) => !s.name || !s.price);
      if (invalidSize) {
        toast.error("يرجى إكمال جميع بيانات الأحجام");
        return;
      }
    }

    const submitData = {
      ...formData,
      base_price: sizes.length > 0 ? null : parseFloat(formData.base_price) || null,
      discount_value: formData.discount_value ? parseFloat(formData.discount_value) : null,
    };

    const submitSizes = sizes.map((s) => ({
      name: s.name,
      price: parseFloat(s.price),
      is_active: s.is_active ?? true,
    }));

    if (editingProd) {
      updateMut.mutate({ prod: submitData, sizes: submitSizes });
    } else {
      createMut.mutate({ prod: submitData, sizes: submitSizes });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 lg:p-8 shadow-sm ring-1 ring-black/5 min-h-[400px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl lg:text-2xl font-semibold text-ink">إدارة المنتجات</h2>
        <Button onClick={handleOpenCreate} className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          إضافة منتج
        </Button>
      </div>

      {isLoadingProducts ? (
        <div className="text-center py-10">جاري التحميل...</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right whitespace-nowrap">الصورة</TableHead>
                <TableHead className="text-right whitespace-nowrap">الاسم</TableHead>
                <TableHead className="text-right whitespace-nowrap">الفئة</TableHead>
                <TableHead className="text-right whitespace-nowrap">السعر</TableHead>
                <TableHead className="text-right whitespace-nowrap">الحالة</TableHead>
                <TableHead className="text-right whitespace-nowrap">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {products.map((prod: any) => {
              const cat = categories.find((c: any) => c.id === prod.category_id);
              const hasSizes = prod.product_sizes && prod.product_sizes.length > 0;
              return (
                <TableRow key={prod.id}>
                  <TableCell>
                    {prod.image_url ? (
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs">
                        بدون صورة
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{prod.name}</TableCell>
                  <TableCell>{cat?.name || "غير محدد"}</TableCell>
                  <TableCell>
                    {hasSizes ? (
                      <span className="text-sm text-gray-500">متعدد الأحجام</span>
                    ) : (
                      <span className="font-semibold">{prod.base_price} ج.م</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${prod.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                    >
                      {prod.is_active ? "نشط" : "غير نشط"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenEdit(prod)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleOpenDelete(prod)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                  لا توجد منتجات بعد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent dir="rtl" className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProd ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المنتج *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: بيتزا مارجريتا"
                />
              </div>
              <div className="space-y-2">
                <Label>الفئة *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(v) => setFormData({ ...formData, category_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="مكونات أو وصف للمنتج"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">رابط الصورة (Image URL)</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                dir="ltr"
                className="text-left"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-0.5">
                <Label>حالة المنتج</Label>
                <div className="text-sm text-gray-500">المنتج النشط يظهر في الموقع</div>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(c) => setFormData({ ...formData, is_active: c })}
              />
            </div>

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
                    <SelectItem value="none">بدون خصم</SelectItem>
                    <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                    <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.discount_type !== "none" && (
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
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">السعر والأحجام</h3>
              </div>

              {sizes.length === 0 && (
                <div className="space-y-2 mb-4">
                  <Label htmlFor="base_price">السعر الأساسي (ج.م) *</Label>
                  <Input
                    id="base_price"
                    type="number"
                    step="0.01"
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                    placeholder="مثال: 120"
                  />
                </div>
              )}

              <div className="space-y-3">
                {sizes.length > 0 && (
                  <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-md mb-2">
                    سيتم تجاهل السعر الأساسي لأن هذا المنتج يحتوي على أحجام.
                  </div>
                )}
                {sizes.map((size, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">اسم الحجم (مثال: وسط)</Label>
                      <Input
                        value={size.name}
                        onChange={(e) => updateSize(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="w-32 space-y-1">
                      <Label className="text-xs">السعر (ج.م)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={size.price}
                        onChange={(e) => updateSize(index, "price", e.target.value)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => removeSize(index)}
                      className="text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSize}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" /> إضافة حجم
                </Button>
              </div>
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
              سيتم حذف المنتج "{deletingProd?.name}" بشكل نهائي مع كافة أحجامه. هذا الإجراء لا يمكن
              التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteMut.mutate(deletingProd?.id)}
            >
              {deleteMut.isPending ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
