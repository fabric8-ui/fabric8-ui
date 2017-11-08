import { AppsService } from 'app/space/create/apps/services/apps.service';

describe('AppsService', () => {

  let svc: AppsService;

  beforeEach(() => {
    svc = new AppsService();
  });

  describe('#getApplications', () => {
    it('should publish faked application IDs', () => {
      svc.getApplications('foo')
        .subscribe(val => {
          expect(val).toEqual(['vertx-hello', 'vertx-paint', 'vertx-wiki']);
        });
    });
  });

  describe('#getEnvironments', () => {
    it('should publish faked environments', () => {
      svc.getEnvironments('foo')
        .subscribe(val => {
          expect(val).toEqual([
            { environmentId: 'envId-stage', name: 'stage' },
            { environmentId: 'envId-run', name: 'run' }
          ]);
        });
    });
  });

  describe('#getPodCount', () => {
    it('should return a number between 1 and 6', () => {
      svc.getPodCount('foo', 'bar')
        .subscribe(val => {
          expect(val).toBeGreaterThanOrEqual(1);
          expect(val).toBeLessThanOrEqual(6);
        });
    });
  });

  describe('#getCpuStat', () => {
    it('should return a "total" value of 10', () => {
      svc.getPodCount('foo', 'bar')
        .subscribe(val => {
          expect(val).toBe(10);
        });
    });

    it('should return a "used" value between 1 and 10', () => {
      svc.getPodCount('foo', 'bar')
        .subscribe(val => {
          expect(val).toBeGreaterThanOrEqual(1);
          expect(val).toBeLessThanOrEqual(10);
        });
    });
  });

  describe('#getMemoryStat', () => {
    it('should return a "total" value of 256', () => {
      svc.getPodCount('foo', 'bar')
        .subscribe(val => {
          expect(val).toBe(400);
        });
    });

    it('should return a "used" value between 100 and 256', () => {
      svc.getPodCount('foo', 'bar')
        .subscribe(val => {
          expect(val).toBeGreaterThanOrEqual(100);
          expect(val).toBeLessThanOrEqual(256);
        });
    });
  });

});
