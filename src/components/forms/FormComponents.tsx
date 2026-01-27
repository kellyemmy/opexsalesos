import { ReactNode } from 'react';
import { FormProvider, useFormContext, UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Reusable FormWrapper Component
 * Wraps React Hook Form Provider with standard form structure
 */
interface FormWrapperProps {
  children: ReactNode;
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void | Promise<void>;
  className?: string;
}

export const FormWrapper = ({
  children,
  form,
  onSubmit,
  className,
}: FormWrapperProps) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
        {children}
      </form>
    </FormProvider>
  );
};

/**
 * Text Input Field Component
 * Reusable wrapper for form text inputs
 */
interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FormInput = ({
  name,
  label,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  className,
}: FormInputProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              className={className}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * Textarea Field Component
 */
interface FormTextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

export const FormTextarea = ({
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
}: FormTextareaProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * Select Field Component
 */
interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: FormSelectOption[];
  required?: boolean;
  disabled?: boolean;
}

export const FormSelect = ({
  name,
  label,
  placeholder = 'Select an option...',
  options,
  required = false,
  disabled = false,
}: FormSelectProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * Form Actions Component
 * Standard submit/cancel buttons
 */
interface FormActionsProps {
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isLoading?: boolean;
  isDirty?: boolean;
  className?: string;
}

export const FormActions = ({
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
  isLoading = false,
  isDirty = true,
  className,
}: FormActionsProps) => {
  return (
    <div className={cn('flex gap-2 justify-end', className)}>
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </Button>
      )}
      <Button type="submit" disabled={!isDirty || isLoading}>
        {isLoading ? 'Loading...' : submitLabel}
      </Button>
    </div>
  );
};
