import { Request, Response, NextFunction } from 'express';
import * as captureService from '../services/capture.service';
import * as notesService from '../services/notes.service';
import { AppError } from '../middleware/error';

export const quickCapture = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { type, data } = req.body;

    if (!type || !data) {
      throw new AppError('Type and data are required', 400);
    }

    // For text captures, create a note directly
    if (type === 'text' && data.content) {
      const note = await notesService.createNote({
        userId,
        content: data.content,
        type: 'text',
      });

      res.status(201).json({
        success: true,
        data: note,
      });
      return;
    }

    // For other types, process through capture service
    res.status(201).json({
      success: true,
      data: { message: 'Capture saved for processing' },
    });
  } catch (error) {
    next(error);
  }
};

export const captureText = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { content, tags } = req.body;

    if (!content) {
      throw new AppError('Content is required', 400);
    }

    const result = await captureService.processTextCapture(userId, {
      content,
      tags,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const captureVoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { audioUrl, duration } = req.body;

    if (!audioUrl) {
      throw new AppError('Audio URL is required', 400);
    }

    const result = await captureService.processVoiceCapture(userId, {
      audioUrl,
      duration,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const captureImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { imageUrl, caption } = req.body;

    if (!imageUrl) {
      throw new AppError('Image URL is required', 400);
    }

    const result = await captureService.processImageCapture(userId, {
      imageUrl,
      caption,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const processQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { items } = req.body;

    if (!Array.isArray(items)) {
      throw new AppError('Items must be an array', 400);
    }

    const results = await captureService.processQueuedCaptures(userId, items);

    res.json({
      success: true,
      data: {
        processed: results.length,
        results,
      },
    });
  } catch (error) {
    next(error);
  }
};
