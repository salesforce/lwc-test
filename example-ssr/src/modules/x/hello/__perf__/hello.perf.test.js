const { expect, browser } = require('@wdio/globals');

describe('Performance metrics tests', () => {
    beforeAll(async () => {
        await browser.url('/hello');
    });

    it('should measure Largest Contentful Paint (LCP) using PerformanceObserver', async () => {
        const lcp = await browser.execute(() => {
            return new Promise((resolve) => {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1]; // Use the latest LCP candidate
                    console.log('LCP:', lastEntry.startTime);
                    observer.disconnect(); // Stop observing
                    resolve(lastEntry.startTime);
                });
                observer.observe({ type: 'largest-contentful-paint', buffered: true });
            });
        });
        expect(lcp).toBeGreaterThan(0);
        expect(lcp).toBeLessThanOrEqual(2500);
    });

    it('should measure Cumulative Layout Shift (CLS) using PerformanceObserver', async () => {
        const cls = await browser.execute(() => {
            return new Promise((resolve) => {
                let cumulativeLayoutShift = 0;

                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            console.log('LayoutShift value:', entry.value);
                            cumulativeLayoutShift += entry.value;

                            if (entry.sources) {
                                for (const { node, currentRect, previousRect } of entry.sources) {
                                    console.log('LayoutShift source:', node, {
                                        currentRect,
                                        previousRect,
                                    });
                                }
                            }
                        }
                    }
                });

                observer.observe({ type: 'layout-shift', buffered: true });

                setTimeout(() => {
                    observer.disconnect();
                    resolve(cumulativeLayoutShift);
                }, 5000);
            });
        });

        console.log(`CLS: ${cls}`);

        expect(cls).toBeGreaterThanOrEqual(0);
        expect(cls).toBeLessThanOrEqual(0.1);
    }, 10000);
});
