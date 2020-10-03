import {BaseRepository} from "./base/BaseRepository";
import {Notification, NotificationDocument} from "../models/Notification";
import {Service} from "typedi";

@Service()
class NotificationRepository extends BaseRepository<NotificationDocument> {
    constructor() {
        super(Notification);
    }
}
Object.seal(NotificationRepository)
export = NotificationRepository