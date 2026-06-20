package com.cod8flow.cod8flow.service;


import com.cod8flow.cod8flow.event.TaskAssignedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskEventProducer {
    private final KafkaTemplate<String,Object> kafkaTemplate;
    private static final String TASK_EVENT_TOPIC = "task_event";
    public void  publishTaskAssigned(TaskAssignedEvent event){
        log.info("Publishing TaskAssignedEven for task: {}",event.getTaskId());
        kafkaTemplate.send(TASK_EVENT_TOPIC,event.getTaskId().toString(),event);
    }
}
