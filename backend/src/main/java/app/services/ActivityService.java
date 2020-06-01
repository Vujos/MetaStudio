package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import app.models.Activity;
import app.repositories.ActivityRepository;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepo;

    public ActivityService() {
    }

    public Iterable<Activity> getActivities() {
        return activityRepo.findAll();
    }

    public Optional<Activity> getActivityById(String id) {
        return activityRepo.findById(id);
    }

    public HttpStatus addActivity(Activity activity) {
        activityRepo.save(activity);
        return HttpStatus.CREATED;
    }

    public void removeActivity(String id) {
        Optional<Activity> activity = activityRepo.findById(id);
        activityRepo.delete(activity.get());
    }

    public void updateActivity(String id, Activity activity) {
        Optional<Activity> oldActivity = activityRepo.findById(id);
        if (oldActivity.isPresent()) {
            activity.setId(oldActivity.get().getId());
            activityRepo.save(activity);
        }
    }

}
