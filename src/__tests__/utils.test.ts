import {
    fadeColorByDistance,
    getBlendedColorForTile,
    getColorDistance,
    computeTileContributions
  } from '../utils';
  
  describe('fadeColorByDistance', () => {
    it('should fade color proportionally to distance', () => {
      const result = fadeColorByDistance([255, 0, 0], 1, 4);
      expect(result).toEqual([204, 0, 0]);
    });
  });
  
  describe('getBlendedColorForTile', () => {
    it('should normalize color so max channel is 255', () => {
      const result = getBlendedColorForTile([100, 200, 50]);
      expect(result).toEqual([100, 200, 50]);
    });
  });
  
  describe('getColorDistance', () => {
    it('should calculate Euclidean distance between two RGB colors', () => {
      const result = getColorDistance([0, 0, 0], [255, 255, 255]);
      expect(result).toBeCloseTo(441.67, 1);
    });
  });
  
  describe('computeTileContributions', () => {
    it('should compute contributions correctly for top source only', () => {
      const topSources:([number, number, number] | null)[] = [[255, 0, 0], null];
      const bottomSources = [null, null];
      const leftSources = [null, null];
      const rightSources = [null, null];
  
      const contributions = computeTileContributions({
        topSources,
        bottomSources,
        leftSources,
        rightSources,
        WIDTH: 2,
        HEIGHT: 2
      });
  
      expect(contributions[0][0][0]).toBeGreaterThan(0);
      expect(contributions[1][0][0]).toBeGreaterThan(0);
    });
  });
  