'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/toast'
import { creatorApplicationSchema } from '@/lib/schemas'
import { PaymentProvider } from '@prisma/client'
import { Plus, Trash2 } from 'lucide-react'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const PAYMENT_PROVIDERS = [
  { value: PaymentProvider.PAYPAL, label: PaymentProvider.PAYPAL },
]

export const CreatorApplicationPaymentMethods: FC<{
  form: ReturnType<typeof useForm<z.infer<typeof creatorApplicationSchema>>>
}> = ({ form }) => {
  const paymentMethods = form.watch('paymentMethods')

  // Add a new payment method
  const addPaymentMethod = () => {
    const currentMethods = form.getValues('paymentMethods')
    form.setValue('paymentMethods', [
      ...currentMethods,
      {
        provider: PaymentProvider.PAYPAL,
        accountIdentifier: '',
        isDefault: !currentMethods.length, // Make default if it's the first one
      },
    ])
  }

  // Remove a payment method
  const removePaymentMethod = (index: number) => {
    const currentMethods = form.getValues('paymentMethods')

    // Don't allow removing the last payment method
    if (currentMethods.length <= 1) {
      toast.error('Cannot remove payment method', {
        description: 'At least one payment method is required',
      })
      return
    }

    // Check if we're removing the default method
    const isRemovingDefault = currentMethods[index].isDefault

    // Remove the method
    const newMethods = currentMethods.filter((_, i) => i !== index)

    // If we removed the default, set the first one as default
    if (isRemovingDefault && !!newMethods.length) {
      newMethods[0].isDefault = true
    }

    form.setValue('paymentMethods', newMethods)
  }

  // Set a payment method as default
  const setDefaultPaymentMethod = (index: number) => {
    const currentMethods = form.getValues('paymentMethods')
    const updatedMethods = currentMethods.map((method, i) => ({
      ...method,
      isDefault: i === index,
    }))
    form.setValue('paymentMethods', updatedMethods)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Payment Methods</h3>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={addPaymentMethod}
          className='flex items-center gap-1'
        >
          <Plus className='h-4 w-4' />
          Add Method
        </Button>
      </div>

      <FormDescription>
        Add payment methods where you&apos;ll receive funds from sales. You must
        add at least one method.
      </FormDescription>

      {paymentMethods.map((_method, index) => (
        <Card key={index} className='border border-muted'>
          <CardContent className='pt-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name={`paymentMethods.${index}.provider`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Provider</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select provider' />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {PAYMENT_PROVIDERS.map((provider) => (
                          <SelectItem
                            key={provider.value}
                            value={provider.value}
                          >
                            {provider.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='mt-4'>
              <FormField
                control={form.control}
                name={`paymentMethods.${index}.accountIdentifier`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.getValues(`paymentMethods.${index}.provider`) ===
                      PaymentProvider.PAYPAL
                        ? 'PayPal Email'
                        : form
                              .getValues(`paymentMethods.${index}.provider`)
                              .startsWith('CRYPTO')
                          ? 'Wallet Address'
                          : 'Account Identifier'}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex items-center justify-between mt-4'>
              <FormField
                control={form.control}
                name={`paymentMethods.${index}.isDefault`}
                render={({ field }) => (
                  <FormItem className='flex items-center space-x-2 space-y-0'>
                    <Button
                      type='button'
                      variant={field.value ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setDefaultPaymentMethod(index)}
                      disabled={field.value}
                    >
                      {field.value ? 'Default Method' : 'Set as Default'}
                    </Button>
                  </FormItem>
                )}
              />

              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => removePaymentMethod(index)}
                className='text-destructive hover:text-destructive/90'
              >
                <Trash2 className='h-4 w-4 mr-1' />
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {form.formState.errors.paymentMethods?.message && (
        <p className='text-sm font-medium text-destructive'>
          {form.formState.errors.paymentMethods?.message}
        </p>
      )}
    </div>
  )
}
