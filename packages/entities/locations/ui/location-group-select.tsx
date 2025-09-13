'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { AddIcon, TrashIcon, EditIcon } from '@shared/icons';
import { Button } from '@shared/ui/forms/button';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/forms/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/modals/dialog';
import { DeleteConfirmationModal } from '@shared/ui/modals/delete-confirmation-modal';
import { toast } from '@shared/lib/conditional-toast';
import { locationGroupsApi, type LocationGroupDTO } from '@shared/api/location-groups';
import { getRegionsForSelect } from '@shared/constants/kyrgyzstan-regions';
import type { LocationCreateFormData } from '../schemas/locationCreateSchema';

interface LocationGroupSelectProps {
  label?: string;
}

export function LocationGroupSelect({ label = 'Группа локации' }: LocationGroupSelectProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<LocationCreateFormData>();

  const [groups, setGroups] = useState<LocationGroupDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<LocationGroupDTO | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<LocationGroupDTO | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCity, setNewGroupCity] = useState('');
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupCity, setEditGroupCity] = useState('');

  const selectedGroupId = watch('group');

  // Загружаем группы при монтировании компонента
  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const response = await locationGroupsApi.getLocationGroups();
      setGroups(response.data);
    } catch (error) {
      console.error('Ошибка загрузки групп:', error);
      toast.error('Ошибка загрузки групп локаций');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error('Введите название группы');
      return;
    }

    if (!newGroupCity) {
      toast.error('Выберите область');
      return;
    }

    try {
      const newGroup = await locationGroupsApi.createLocationGroup({ 
        name: newGroupName.trim(),
        city: newGroupCity
      });
      setGroups(prev => [...prev, newGroup]);
      setNewGroupName('');
      setNewGroupCity('');
      setIsCreateModalOpen(false);
      toast.success('Группа создана успешно');
    } catch (error) {
      console.error('Ошибка создания группы:', error);
      toast.error('Ошибка создания группы');
    }
  };

  const handleEditGroup = async () => {
    if (!editingGroup || !editGroupName.trim()) {
      toast.error('Введите название группы');
      return;
    }

    if (!editGroupCity) {
      toast.error('Выберите область');
      return;
    }

    try {
      const updatedGroup = await locationGroupsApi.updateLocationGroup(editingGroup.id, { 
        name: editGroupName.trim(),
        city: editGroupCity
      });
      setGroups(prev => prev.map(group => 
        group.id === editingGroup.id ? updatedGroup : group
      ));
      setEditGroupName('');
      setEditGroupCity('');
      setEditingGroup(null);
      setIsEditModalOpen(false);
      toast.success('Группа обновлена успешно');
    } catch (error) {
      console.error('Ошибка обновления группы:', error);
      toast.error('Ошибка обновления группы');
    }
  };

  const handleDeleteGroup = async () => {
    if (!deletingGroup) return;
    
    try {
      await locationGroupsApi.deleteLocationGroup(deletingGroup.id);
      setGroups(prev => prev.filter(group => group.id !== deletingGroup.id));
      
      // Если удаляемая группа была выбрана, сбрасываем выбор
      if (selectedGroupId === deletingGroup.id) {
        setValue('group', '');
      }
      
      toast.success('Группа удалена успешно');
      setIsDeleteModalOpen(false);
      setDeletingGroup(null);
    } catch (error) {
      console.error('Ошибка удаления группы:', error);
      toast.error('Ошибка удаления группы');
    }
  };

  const openDeleteModal = (group: LocationGroupDTO) => {
    setDeletingGroup(group);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = (group: LocationGroupDTO) => {
    setEditingGroup(group);
    setEditGroupName(group.name);
    setEditGroupCity(group.city);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="groupId" className="text-sm font-medium">
        {label}
      </Label>
      
      <div className="flex gap-2">
        <Select value={selectedGroupId || ''} onValueChange={(value) => setValue('group', value)}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Выберите группу локации" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Кнопка создания новой группы */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="icon">
              <AddIcon size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать новую группу</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newGroupName">Название группы</Label>
                <Input
                  id="newGroupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Введите название группы"
                />
              </div>
              <div>
                <Label htmlFor="newGroupCity">Область</Label>
                <Select value={newGroupCity} onValueChange={setNewGroupCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите область" />
                  </SelectTrigger>
                  <SelectContent>
                    {getRegionsForSelect().map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setNewGroupName('');
                    setNewGroupCity('');
                  }}
                >
                  Отмена
                </Button>
                <Button
                  type="button"
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim() || !newGroupCity}
                >
                  Создать
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Список групп с возможностью редактирования и удаления */}
      {groups.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Управление группами:</Label>
          <div className="space-y-1">
            {groups.map((group) => (
              <div key={group.id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{group.name}</span>
                  <span className="text-xs text-muted-foreground">{group.city}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(group)}
                  >
                    <EditIcon size={14} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteModal(group)}
                  >
                    <TrashIcon size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Модальное окно редактирования группы */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать группу</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editGroupName">Название группы</Label>
              <Input
                id="editGroupName"
                value={editGroupName}
                onChange={(e) => setEditGroupName(e.target.value)}
                placeholder="Введите название группы"
              />
            </div>
            <div>
              <Label htmlFor="editGroupCity">Область</Label>
              <Select value={editGroupCity} onValueChange={setEditGroupCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите область" />
                </SelectTrigger>
                <SelectContent>
                  {getRegionsForSelect().map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditGroupName('');
                  setEditGroupCity('');
                  setEditingGroup(null);
                }}
              >
                Отмена
              </Button>
              <Button
                type="button"
                onClick={handleEditGroup}
                disabled={!editGroupName.trim() || !editGroupCity}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {errors.group && (
        <p className="text-sm text-red-600">{errors.group.message}</p>
      )}

      {/* Модальное окно подтверждения удаления */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingGroup(null);
        }}
        onConfirm={handleDeleteGroup}
        title="Удалить группу?"
        description="Вы уверены, что хотите удалить эту группу локаций?"
        itemName={deletingGroup?.name}
        warningText="Все локации в этой группе останутся без группы."
      />
    </div>
  );
}
