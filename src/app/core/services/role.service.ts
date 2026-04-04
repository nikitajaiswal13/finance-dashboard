import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Role = 'admin' | 'viewer';

@Injectable({ providedIn: 'root' })

export class RoleService {
    private _role = new BehaviorSubject<Role>('viewer');
    role$ = this._role.asObservable();

    getRole(): Role {
        return this._role.getValue();
    }

    setRole(role: Role): void {
        this._role.next(role);
    }
}