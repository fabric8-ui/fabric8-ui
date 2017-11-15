import { AppsService } from 'app/space/create/apps/services/apps.service';

describe('AppsService', () => {

  let svc: AppsService;

  beforeEach(() => {
    svc = new AppsService();
  });

  describe('#getApplications', () => {
    it('should publish faked application IDs', (done: DoneFn) => {
      svc.getApplications('foo')
        .subscribe(val => {
          expect(val).toEqual(['vertx-hello', 'vertx-paint', 'vertx-wiki']);
          done();
        });
    });
  });

  describe('#getEnvironments', () => {
    it('should publish faked environments', (done: DoneFn) => {
      svc.getEnvironments('foo')
        .subscribe(val => {
          expect(val).toEqual([
            { environmentId: 'envId-stage', name: 'stage' },
            { environmentId: 'envId-run', name: 'run' }
          ]);
          done();
        });
    });
  });

  describe('#getPodCount', () => {
    it('should return a number between 1 and 6', (done: DoneFn) => {
      svc.getPodCount('foo', 'bar')
        .subscribe(val => {
          expect(val).toBeGreaterThanOrEqual(1);
          expect(val).toBeLessThanOrEqual(6);
          done();
        });
    });
  });

  describe('#getVersion', () => {
    it('should return 1.0.2', (done: DoneFn) => {
      svc.getVersion('foo', 'bar').subscribe(val => {
        expect(val).toEqual('1.0.2');
        done();
      });
    });
  });

  describe('#getCpuStat', () => {
    it('should return a "total" value of 10', (done: DoneFn) => {
      svc.getPodCount('foo', 'bar')
        .subscribe(val => {
          expect(val).toBe(10);
          done();
        });
    });

    it('should return a "used" value between 1 and 10', (done: DoneFn) => {
      svc.getPodCount('foo', 'bar')
        .subscribe(val => {
          expect(val).toBeGreaterThanOrEqual(1);
          expect(val).toBeLessThanOrEqual(10);
          done();
        });
    });
  });

  describe('#getMemoryStat', () => {
    it('should return a "total" value of 256', (done: DoneFn) => {
      svc.getPodCount('foo', 'bar')
        .subscribe(val => {
          expect(val).toBe(400);
          done();
        });
    });

    it('should return a "used" value between 100 and 256', (done: DoneFn) => {
      svc.getPodCount('foo', 'bar')
        .subscribe(val => {
          expect(val).toBeGreaterThanOrEqual(100);
          expect(val).toBeLessThanOrEqual(256);
          done();
        });
    });
  });

});
