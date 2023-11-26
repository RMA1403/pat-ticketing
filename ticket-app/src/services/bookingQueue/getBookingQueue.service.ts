import db from "@/database/drizzle";
import { bookingQueue } from "@/models";
import { asc, eq } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";

export interface GetBookingQueueRequest {
    seatId?: string;
    page?: string;
    pageSize?: string;
}

function withFilter<T extends PgSelect>(qb: T, seatId: string) {
    return qb.where(eq(bookingQueue.seat_id, seatId))
}

const getBookingQueueService = async (req: GetBookingQueueRequest) => {
    console.log(`getBookingQueueService: ${JSON.stringify(req)}`)
    
    const pageSize = req.pageSize ? parseInt(req.pageSize) : 25;
    const seatId = req.seatId
    const page = req.page ? Math.max(parseInt(req.page), 1) : 1;

    let queue = db.select().from(bookingQueue)
            .orderBy(asc(bookingQueue.created_at))
            .limit(pageSize)
            .offset(pageSize * (page - 1))
            .$dynamic();
    
    if (seatId) {
        queue = withFilter(queue, seatId)
    }

    return queue;
}

export default getBookingQueueService;