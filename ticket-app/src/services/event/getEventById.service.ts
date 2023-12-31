import { DrizzlePool } from "@/common/types";
import { events } from "@/models";
import { Logger } from "@/utils";
import { eq } from "drizzle-orm";

export interface GetEventByIdRequest {
    id: string;
}

const getEventByIdService = async (db: DrizzlePool, req: GetEventByIdRequest) => {
    Logger.info(`getEventByIdService: ${JSON.stringify(req)}`);
    const res = await db.select({
        title: events.title,
        id: events.id,
        created_at: events.created_at,
        updated_at: events.updated_at,
    }).from(events)
        .where(eq(events.id, req.id))
        
    const event = res[0]
    return event;
}

export default getEventByIdService;