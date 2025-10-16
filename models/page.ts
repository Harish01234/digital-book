import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEntry {
  no: number;
  money: number;
  interest?: number;
  date: Date;
}

export interface IPage extends Document {
  title: string;
  type: 'deoya' | 'neoya';
  entries: IEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const EntrySchema = new Schema<IEntry>({
  no: { type: Number, required: true },
  money: { type: Number, required: true },
  interest: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

const PageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['deoya', 'neoya'], required: true },
    entries: [EntrySchema],
  },
  {
    timestamps: true,
  }
);

const Page: Model<IPage> = mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);

export default Page;
