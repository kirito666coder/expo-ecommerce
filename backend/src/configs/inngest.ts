import { Inngest } from 'inngest';
import { ConnectDB } from './db';
import { userModel } from '../models';

interface ClerkUserCreatedData {
  id: string;
  email_addresses: { email_address: string }[];
  first_name?: string;
  last_name?: string;
  image_url?: string;
}

interface ClerkUserDeletedData {
  id: string;
}

export const inngest = new Inngest({ id: 'ecommerce-app', isDev: false });

const syncUser = inngest.createFunction(
  { id: 'sync-user' },
  { event: 'clerk/user.created' },
  async ({ event }: { event: { data: ClerkUserCreatedData } }) => {
    if (!event) return;
    await ConnectDB();
    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const newUser = {
      uid: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
      imageUrl: image_url || '',
      addresses: [],
      wishlist: [],
    };
    const existing = await userModel.findOne({ uid: id });
    if (!existing) {
      await userModel.create(newUser);
    }
  },
);

const deleteUserFromDB = inngest.createFunction(
  { id: 'delete-user-from-db' },
  { event: 'clerk/user.deleted' },
  async ({ event }: { event: { data: ClerkUserDeletedData } }) => {
    await ConnectDB();

    const { id } = event.data;
    await userModel.deleteOne({ uid: id });
  },
);

export const functions = [syncUser, deleteUserFromDB];
