# Tanstack Form addresses and radio buttons

Simplified demo of a common pattern of a form where the billing address is hidden by default and becomes compulsory when it appears.

All fields are required, if visible. Basically if the billing address is the same as mailing address, it does not need to be filled in and is not displayed. Otherwise it's visible and required.

Right now it seems to work as expected but I have 3 remarks, see below.

## First Zod annoyance

I feel like the proper Zod schema should be a discriminated union:

```typescript
export const AddressesDataSchema = z.discriminatedUnion(
  "separateBillingAddress",
  [
    z.object({
      separateBillingAddress: z.literal(false),
      mailingAddress: z.string().trim().min(1),
      billingAddress: z.string().optional(),
    }),
    z.object({
      separateBillingAddress: z.literal(true),
      mailingAddress: z.string().trim().min(1),
      billingAddress: z.string().trim().min(1),
    }),
  ]
);
```

But then `onChange: AddressesDataSchema` is not happy:

```
Types of property 'billingAddress' are incompatible.
  Type 'string | undefined' is not assignable to type 'string'.
    Type 'undefined' is not assignable to type 'string'.ts(2322)
```

## Second Zod annoyance

If I just change line 43 to use again `satisfies AddressesData` for `defaultValues` (which is a best practice) then I have another error on `onChange: AddressesDataSchema`:

```
Type 'Types<{ separateBillingAddress: boolean; mailingAddress: string; billingAddress: string; }, { separateBillingAddress: boolean; mailingAddress: string; billingAddress: string; }>' is not assignable to type 'StandardSchemaV1Types<{ separateBillingAddress: false; mailingAddress: string; billingAddress: string; }, unknown>'.
  The types of 'input.separateBillingAddress' are incompatible between these types.
    Type 'boolean' is not assignable to type 'false'.ts(2322)
```

Which is werd because (at first sight) everything works as expected without the `satisfies`.

## Radio buttons

I did not find any examples of handling radio buttons in the Tanstack Form repository, so I hope the way I've done it here is the correct way! Feel free to suggest improvements.
